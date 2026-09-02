
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Mic,
  Paperclip,
  Send,
  Sparkles,
  CornerDownLeft,
  Zap,
  MessageSquare,
  Code2,
  FileText,
  Presentation,
  ImageIcon,
  Globe2,
  X
} from 'lucide-react';

// Feature & Redux Imports
import sendMessage from '../features/sendMessage';
import { addMessage, setArtifacts } from '../redux/messageSlice';
import {
  addConversation,
  setConvTitle,
  setSelectedConversation
} from '../redux/conversationSlice';
import { createConversation } from '../features/createConversation';
import { updateConversation } from '../features/updateConversation';

function ChatInput() {
  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const [selectedAgent, setSelectedAgent] = useState("Auto");

  // Attachment state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  const fileRef = useRef(null);

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const handleSendMessage = async () => {
    let conversation = selectedConversation;

    if (!conversation) {
      const { data } = await createConversation();

      console.log(data);

      dispatch(setSelectedConversation(data.conversation));
      dispatch(addConversation(data.conversation));

      conversation = data.conversation;
    }

    if (conversation?.title === "New Conversation") {
      await updateConversation({
        id: conversation._id,
        title: value.trim()
      });

      dispatch(
        setConvTitle({
          conversationId: conversation._id,
          title: value.trim()
        })
      );
    }

    // Allow sending when either text OR a file exists
    if (
      (value.trim().length === 0 && !selectedFile) ||
      !conversation?._id ||
      isLoading
    ) {
      return;
    }

    const userPrompt = value.trim();

    // Save attachment before clearing state
    const fileToSend = selectedFile;

    // Instant UX feedback
    setValue("");
    setSelectedFile(null);
    setFilePreviewUrl(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "conversationId",
        conversation._id
      );

      formData.append(
        "prompt",
        userPrompt
      );

      formData.append(
        "agent",
        selectedAgent.toLowerCase()
      );

      // Attach file
      if (fileToSend) {
        formData.append(
          "file",
          fileToSend
        );
      }

      // =====================================================
      // OPTIMISTIC USER MESSAGE
      // =====================================================

      dispatch(
        addMessage({
          role: "user",
          content: userPrompt,
          conversationId: conversation._id,

          // Keep attachment metadata for the message UI
          attachment: fileToSend
            ? {
                name: fileToSend.name,
                type: fileToSend.type,
                size: fileToSend.size
              }
            : null
        })
      );

      // =====================================================
      // BACKEND REQUEST
      // =====================================================

      const data = await sendMessage(formData);

      dispatch(
        setArtifacts(
          data?.artifacts || []
        )
      );

      console.log(
        "Response data:",
        data
      );

      // =====================================================
      // ASSISTANT MESSAGE
      // =====================================================

      dispatch(
        addMessage({
          role: "assistant",
          content: data?.answer,
          conversationId: conversation._id,
          images: data?.images || []
        })
      );

    } catch (err) {
      console.error(
        "Message error:",
        err
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // FILE SELECTION
  // =========================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    // Create preview only for images
    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);

      setFilePreviewUrl(previewUrl);
    } else {
      // PDFs don't need object URL preview
      setFilePreviewUrl(null);
    }

    console.log(
      "Selected file:",
      file
    );
  };

  // =========================================================
  // REMOVE ATTACHMENT
  // =========================================================

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // =========================================================
  // CLEANUP IMAGE OBJECT URL
  // =========================================================

  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // =========================================================
  // KEYBOARD SHORTCUT
  // =========================================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  // =========================================================
  // SEND BUTTON STATE
  // =========================================================

  const isBtnDisabled =
    (
      value.trim().length === 0 &&
      !selectedFile
    ) ||
    isLoading;

  // =========================================================
  // AGENTS
  // =========================================================

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding"
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF"
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT"
    },
    {
      id: "image",
      icon: ImageIcon,
      label: "Image"
    },
    {
      id: "search",
      icon: Globe2,
      label: "Search"
    }
  ];

  // =========================================================
  // FILE HELPERS
  // =========================================================

  const isPDF = selectedFile?.type === "application/pdf";

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="w-full p-4 sm:p-6 bg-gradient-to-t from-[#000000] via-[#000000]/90 to-transparent shrink-0 z-20">

      <div className="max-w-4xl mx-auto flex flex-col gap-2">

        {/* =================================================
            MAIN FLOATING INPUT BOX
        ================================================= */}

        <motion.div
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            duration: 0.3
          }}
          className="relative bg-[#0a0a0d]/80 backdrop-blur-xl border border-[#edede6]/15 focus-within:border-[#beff8b]/50 focus-within:shadow-[0_0_25px_rgba(190,255,139,0.12)] rounded-2xl p-3 transition-all duration-200"
        >

          {/* =================================================
              AGENT SELECTOR
          ================================================= */}

          <div className="flex items-center gap-2 mb-2 overflow-x-auto custom-scrollbar">

            {agents.map((agent) => {

              const isActive =
                selectedAgent === agent.label;

              const Icon = agent.icon;

              return (
                <div
                  key={agent.id}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#beff8b]/10 border-[#beff8b] text-[#beff8b]"
                      : "bg-[#d5bafb]/10 border-[#d5bafb]/20 text-[#d5bafb]"
                  }`}
                  onClick={() =>
                    setSelectedAgent(agent.label)
                  }
                >

                  <Icon
                    size={16}
                    className={
                      isActive
                        ? "text-[#beff8b]"
                        : "text-[#d5bafb]"
                    }
                  />

                  <span>
                    {agent.label}
                  </span>

                </div>
              );
            })}

          </div>

          {/* =================================================
              ATTACHMENT PREVIEW
          ================================================= */}

          {selectedFile && (

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.98
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              transition={{
                duration: 0.2
              }}
              className="mb-3"
            >

              <div className="relative inline-flex max-w-full items-center gap-3 rounded-2xl border border-[#edede6]/15 bg-[#141418]/90 p-2.5 pr-10 shadow-[0_8px_25px_rgba(0,0,0,0.25)]">

                {/* =========================================
                    IMAGE THUMBNAIL
                ========================================= */}

                {filePreviewUrl ? (

                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#edede6]/10 bg-black/30 shrink-0">

                    <img
                      src={filePreviewUrl}
                      alt={selectedFile.name}
                      className="w-full h-full object-cover"
                    />

                  </div>

                ) : (

                  /* =========================================
                     PDF PREVIEW
                  ========================================= */

                  <div className="w-16 h-16 rounded-xl border border-red-400/20 bg-red-400/10 flex flex-col items-center justify-center shrink-0">

                    <FileText
                      size={27}
                      className="text-red-400"
                    />

                    <span className="text-[9px] font-bold text-red-400 mt-0.5">
                      PDF
                    </span>

                  </div>

                )}

                {/* =========================================
                    FILE INFORMATION
                ========================================= */}

                <div className="min-w-0">

                  <p className="max-w-[260px] truncate text-sm font-medium text-[#edede6]">
                    {selectedFile.name}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-[#edede6]/45">

                    <span>
                      {isPDF
                        ? "PDF"
                        : "Image"}
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </span>

                  </div>

                </div>

                {/* =========================================
                    REMOVE BUTTON
                ========================================= */}

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label="Remove attachment"
                  title="Remove attachment"
                  className="absolute right-2 top-2 p-1.5 rounded-lg text-[#edede6]/45 hover:text-[#edede6] hover:bg-[#edede6]/10 transition-colors"
                >

                  <X size={15} />

                </button>

              </div>

            </motion.div>

          )}

          {/* =================================================
              TEXTAREA
          ================================================= */}

          <textarea
            rows={2}
            onChange={(e) =>
              setValue(e.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            value={value}
            placeholder={
              selectedConversation
                ? "Ask the Multi-Agent engine anything... (e.g. Analyze document or run task)"
                : "Select a conversation from the sidebar to start messaging..."
            }
            className="w-full bg-transparent text-[#edede6] placeholder:text-[#edede6]/30 text-sm sm:text-base focus:outline-none resize-none pr-2 custom-scrollbar disabled:opacity-50"
          />

          {/* =================================================
              BOTTOM ACTION BAR
          ================================================= */}

          <div className="flex items-center justify-between pt-2 border-t border-[#edede6]/10 mt-1">

            {/* =================================================
                HIDDEN FILE INPUT
            ================================================= */}

            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={handleFileChange}
            />

            {/* =================================================
                LEFT ACTIONS
            ================================================= */}

            <div className="flex items-center gap-1 sm:gap-2">

              {/* ATTACH */}

              <motion.button
                whileHover={{
                  scale: 1.05
                }}
                whileTap={{
                  scale: 0.95
                }}
                type="button"
                onClick={() =>
                  fileRef.current?.click()
                }
                className="p-2 rounded-xl text-[#edede6]/50 hover:text-[#edede6] hover:bg-[#edede6]/[0.08] transition-colors"
                title="Attach PDF or Image"
              >

                <Paperclip size={18} />

              </motion.button>

              {/* VOICE */}

              <motion.button
                whileHover={{
                  scale: 1.05
                }}
                whileTap={{
                  scale: 0.95
                }}
                type="button"
                className="p-2 rounded-xl text-[#edede6]/50 hover:text-[#edede6] hover:bg-[#edede6]/[0.08] transition-colors"
                title="Voice Input"
              >

                <Mic size={18} />

              </motion.button>

              {/* MULTI AGENT MODE */}

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d5bafb]/10 text-[#d5bafb] text-[11px] font-mono border border-[#d5bafb]/20 ml-1">

                <Sparkles size={12} />

                Multi-Agent Mode

              </div>

            </div>

            {/* =================================================
                SEND BUTTON
            ================================================= */}

            <motion.button
              whileHover={
                !isBtnDisabled
                  ? { scale: 1.05 }
                  : {}
              }
              whileTap={
                !isBtnDisabled
                  ? { scale: 0.95 }
                  : {}
              }
              disabled={isBtnDisabled}
              onClick={handleSendMessage}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isBtnDisabled
                  ? "bg-[#edede6]/10 text-[#edede6]/30 cursor-not-allowed"
                  : "bg-[#beff8b] text-black shadow-[0_0_18px_rgba(190,255,139,0.3)] hover:bg-[#beff8b]/90 cursor-pointer"
              }`}
            >

              {isLoading ? (

                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />

              ) : (

                <>
                  <span className="hidden sm:inline">
                    Send
                  </span>

                  <Send
                    size={15}
                    className="stroke-[2.5]"
                  />
                </>

              )}

            </motion.button>

          </div>

        </motion.div>

        {/* =================================================
            FOOTER SHORTCUT
        ================================================= */}

        <div className="flex items-center justify-between px-2 text-[11px] text-[#edede6]/30 font-mono">

          <span className="flex items-center gap-1">

            <CornerDownLeft size={10} />

            <span className="text-[#edede6]/50">
              Enter
            </span>

            to send,

            <span className="text-[#edede6]/50">
              Shift + Enter
            </span>

            for new line

          </span>

          <span className="hidden sm:inline">
            Shubh AI
          </span>

        </div>

      </div>

    </div>
  );
}

export default ChatInput;

