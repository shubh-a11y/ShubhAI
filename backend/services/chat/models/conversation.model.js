
const conversationSchema = new mongoose.Schema({
    title:{
        type: String,
        default: "New Conversation"
    },

    userId:{
        type: String
    }
}, {timestamps: true});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
