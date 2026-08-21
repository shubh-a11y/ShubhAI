import pptxgen from "pptxgenjs";

const COLORS = {
    primary: "2563EB",
    secondary: "0F172A",
    text: "334155",
    light: "F8FAFC",
    border: "E2E8F0",
    white: "FFFFFF",
    muted: "64748B",
    blueLight: "EFF6FF",
    blueLighter: "DBEAFE",
    darkBlue: "1E3A8A",
    accent: "38BDF8",
};


// ============================================================
// MAIN GENERATOR
// ============================================================

export const generatePpt = async (data) => {

    const ppt = new pptxgen();

    ppt.layout = "LAYOUT_WIDE";

    ppt.author = "Shubh AI";
    ppt.title = data?.title || "Presentation";
    ppt.subject = data?.title || "";
    ppt.company = "Shubh AI";

    ppt.theme = {
        headFontFace: "Aptos Display",
        bodyFontFace: "Aptos",
        lang: "en-US"
    };

    // --------------------------------------------------------
    // COVER
    // --------------------------------------------------------

    addCover(ppt, data);


    // --------------------------------------------------------
    // CONTENT SLIDES
    // --------------------------------------------------------

    const slides = data?.slides || [];

    slides.forEach((slideData, index) => {

        const layoutType = index % 4;

        if (layoutType === 0) {

            addFeatureCardsSlide(
                ppt,
                slideData.title,
                slideData.points,
                index + 1,
                slides.length
            );

        }
        else if (layoutType === 1) {

            addTwoColumnSlide(
                ppt,
                slideData.title,
                slideData.points,
                index + 1,
                slides.length
            );

        }
        else if (layoutType === 2) {

            addTimelineSlide(
                ppt,
                slideData.title,
                slideData.points,
                index + 1,
                slides.length
            );

        }
        else {

            addHighlightSlide(
                ppt,
                slideData.title,
                slideData.points,
                index + 1,
                slides.length
            );

        }

    });


    // --------------------------------------------------------
    // END
    // --------------------------------------------------------

    addThankYou(ppt);

    return ppt;
};



// ============================================================
// COVER SLIDE
// ============================================================

const addCover = (ppt, data) => {

    const slide = ppt.addSlide();

    slide.background = {
        color: COLORS.secondary
    };


    // Large blue vertical accent

    slide.addShape(ppt.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.18,
        h: 7.5,
        fill: {
            color: COLORS.primary
        },
        line: {
            color: COLORS.primary
        }
    });


    // Decorative circles

    slide.addShape(ppt.ShapeType.ellipse, {
        x: 10.2,
        y: -0.8,
        w: 3.4,
        h: 3.4,
        fill: {
            color: COLORS.primary,
            transparency: 20
        },
        line: {
            color: COLORS.primary,
            transparency: 100
        }
    });

    slide.addShape(ppt.ShapeType.ellipse, {
        x: 11.1,
        y: 4.9,
        w: 2.2,
        h: 2.2,
        fill: {
            color: COLORS.accent,
            transparency: 45
        },
        line: {
            color: COLORS.accent,
            transparency: 100
        }
    });


    // Small label

    slide.addText("SHUBH AI", {
        x: 0.75,
        y: 0.65,
        w: 2,
        h: 0.3,

        fontFace: "Aptos",
        fontSize: 12,
        bold: true,

        color: COLORS.accent,

        charSpacing: 2
    });


    // Main title

    slide.addText(data?.title || "Presentation", {

        x: 0.75,
        y: 1.55,

        w: 8.8,
        h: 1.45,

        fontFace: "Aptos Display",
        fontSize: 34,
        bold: true,

        color: COLORS.white,

        margin: 0,

        breakLine: false,

        fit: "shrink"
    });


    // Subtitle

    if (data?.subtitle) {

        slide.addText(data.subtitle, {

            x: 0.78,
            y: 3.25,

            w: 7.6,
            h: 1.0,

            fontFace: "Aptos",
            fontSize: 17,

            color: "CBD5E1",

            margin: 0,

            breakLine: false,

            fit: "shrink"
        });

    }


    // Bottom metadata

    slide.addShape(ppt.ShapeType.line, {

        x: 0.78,
        y: 6.15,

        w: 2.0,
        h: 0,

        line: {
            color: COLORS.primary,
            width: 2.5
        }

    });


    slide.addText("Created with Shubh AI", {

        x: 0.78,
        y: 6.38,

        w: 3.5,
        h: 0.3,

        fontSize: 11,

        color: "94A3B8",

        margin: 0

    });

};



// ============================================================
// HEADER
// ============================================================

const addHeader = (
    ppt,
    slide,
    title,
    slideNumber,
    totalSlides
) => {

    // Slide number

    slide.addText(
        String(slideNumber).padStart(2, "0"),
        {
            x: 0.65,
            y: 0.42,

            w: 0.5,
            h: 0.35,

            fontSize: 11,
            bold: true,

            color: COLORS.primary,

            margin: 0
        }
    );


    // Title

    slide.addText(title, {

        x: 1.15,
        y: 0.35,

        w: 9.2,
        h: 0.55,

        fontFace: "Aptos Display",
        fontSize: 25,

        bold: true,

        color: COLORS.secondary,

        margin: 0,

        fit: "shrink"

    });


    // Top line

    slide.addShape(ppt.ShapeType.line, {

        x: 0.65,
        y: 1.08,

        w: 12.05,
        h: 0,

        line: {
            color: COLORS.border,
            width: 1
        }

    });


    // Footer

    slide.addText(
        `SHUBH AI  •  ${slideNumber}/${totalSlides}`,
        {

            x: 10.1,
            y: 7.05,

            w: 2.6,
            h: 0.2,

            fontSize: 8,

            color: COLORS.muted,

            align: "right",

            margin: 0
        }
    );

};



// ============================================================
// LAYOUT 1
// FEATURE CARDS
// ============================================================

const addFeatureCardsSlide = (
    ppt,
    title,
    points,
    slideNumber,
    totalSlides
) => {

    const slide = ppt.addSlide();

    slide.background = {
        color: COLORS.light
    };

    addHeader(
        ppt,
        slide,
        title,
        slideNumber,
        totalSlides
    );


    const visiblePoints = points.slice(0, 6);


    const cardPositions = [

        { x: 0.7, y: 1.45 },
        { x: 4.35, y: 1.45 },
        { x: 8.0, y: 1.45 },

        { x: 0.7, y: 4.15 },
        { x: 4.35, y: 4.15 },
        { x: 8.0, y: 4.15 }

    ];


    visiblePoints.forEach((point, index) => {

        const pos = cardPositions[index];

        if (!pos) return;


        // Card shadow/background

        slide.addShape(ppt.ShapeType.roundRect, {

            x: pos.x,
            y: pos.y,

            w: 3.25,
            h: 2.15,

            rectRadius: 0.08,

            fill: {
                color: COLORS.white
            },

            line: {
                color: COLORS.border,
                width: 1
            }

        });


        // Number circle

        slide.addShape(ppt.ShapeType.ellipse, {

            x: pos.x + 0.22,
            y: pos.y + 0.22,

            w: 0.43,
            h: 0.43,

            fill: {
                color: COLORS.blueLight
            },

            line: {
                color: COLORS.blueLight
            }

        });


        slide.addText(
            String(index + 1).padStart(2, "0"),
            {

                x: pos.x + 0.22,
                y: pos.y + 0.29,

                w: 0.43,
                h: 0.15,

                fontSize: 8,

                bold: true,

                color: COLORS.primary,

                align: "center",

                margin: 0

            }
        );


        // Point

        slide.addText(point, {

            x: pos.x + 0.25,
            y: pos.y + 0.82,

            w: 2.75,
            h: 1.05,

            fontFace: "Aptos",

            fontSize: 14,

            bold: true,

            color: COLORS.secondary,

            margin: 0.02,

            valign: "mid",

            fit: "shrink"

        });


        // Accent line

        slide.addShape(ppt.ShapeType.line, {

            x: pos.x + 0.25,
            y: pos.y + 1.85,

            w: 0.7,
            h: 0,

            line: {
                color: COLORS.primary,
                width: 2
            }

        });

    });

};



// ============================================================
// LAYOUT 2
// TWO COLUMN
// ============================================================

const addTwoColumnSlide = (
    ppt,
    title,
    points,
    slideNumber,
    totalSlides
) => {

    const slide = ppt.addSlide();

    slide.background = {
        color: COLORS.white
    };

    addHeader(
        ppt,
        slide,
        title,
        slideNumber,
        totalSlides
    );


    const visiblePoints = points.slice(0, 6);

    const leftPoints = visiblePoints.slice(0, 3);
    const rightPoints = visiblePoints.slice(3, 6);


    // Left visual panel

    slide.addShape(ppt.ShapeType.roundRect, {

        x: 0.7,
        y: 1.5,

        w: 3.2,
        h: 4.95,

        fill: {
            color: COLORS.secondary
        },

        line: {
            color: COLORS.secondary
        }

    });


    slide.addText(
        String(slideNumber).padStart(2, "0"),
        {

            x: 1.0,
            y: 1.95,

            w: 1.5,
            h: 1.0,

            fontFace: "Aptos Display",

            fontSize: 42,

            bold: true,

            color: COLORS.primary,

            margin: 0

        }
    );


    slide.addText(
        "KEY\nIDEAS",
        {

            x: 1.0,
            y: 3.05,

            w: 2.0,
            h: 1.0,

            fontFace: "Aptos Display",

            fontSize: 24,

            bold: true,

            color: COLORS.white,

            margin: 0

        }
    );


    slide.addShape(ppt.ShapeType.line, {

        x: 1.0,
        y: 4.35,

        w: 1.1,
        h: 0,

        line: {
            color: COLORS.accent,
            width: 3
        }

    });


    slide.addText(
        "Explore the\nmost important\nconcepts.",
        {

            x: 1.0,
            y: 4.65,

            w: 2.1,
            h: 1.1,

            fontSize: 13,

            color: "CBD5E1",

            margin: 0

        }
    );


    // Right content

    const renderColumn = (
        columnPoints,
        x
    ) => {

        columnPoints.forEach(
            (point, index) => {

                const y = 1.55 + index * 1.58;


                // Number

                slide.addText(
                    String(index + 1).padStart(2, "0"),
                    {

                        x,
                        y,

                        w: 0.45,
                        h: 0.3,

                        fontSize: 10,

                        bold: true,

                        color: COLORS.primary,

                        margin: 0

                    }
                );


                // Point

                slide.addText(point, {

                    x: x + 0.65,
                    y: y - 0.02,

                    w: 3.65,
                    h: 0.95,

                    fontSize: 14,

                    color: COLORS.text,

                    bold: true,

                    margin: 0.02,

                    fit: "shrink"

                });


                // Divider

                if (index < columnPoints.length - 1) {

                    slide.addShape(
                        ppt.ShapeType.line,
                        {

                            x,
                            y: y + 1.18,

                            w: 4.2,
                            h: 0,

                            line: {
                                color: COLORS.border,
                                width: 1
                            }

                        }
                    );

                }

            }
        );

    };


    renderColumn(leftPoints, 4.35);

    renderColumn(rightPoints, 8.75);

};



// ============================================================
// LAYOUT 3
// TIMELINE / PROGRESSION
// ============================================================

const addTimelineSlide = (
    ppt,
    title,
    points,
    slideNumber,
    totalSlides
) => {

    const slide = ppt.addSlide();

    slide.background = {
        color: COLORS.light
    };

    addHeader(
        ppt,
        slide,
        title,
        slideNumber,
        totalSlides
    );


    const visiblePoints = points.slice(0, 5);


    // Timeline line

    slide.addShape(ppt.ShapeType.line, {

        x: 1.25,
        y: 2.05,

        w: 0,
        h: 4.15,

        line: {
            color: COLORS.primary,
            width: 2
        }

    });


    visiblePoints.forEach(
        (point, index) => {

            const y = 1.65 + index * 1.02;


            // Node

            slide.addShape(
                ppt.ShapeType.ellipse,
                {

                    x: 1.03,
                    y: y + 0.17,

                    w: 0.44,
                    h: 0.44,

                    fill: {
                        color: COLORS.white
                    },

                    line: {
                        color: COLORS.primary,
                        width: 2
                    }

                }
            );


            // Inner node

            slide.addShape(
                ppt.ShapeType.ellipse,
                {

                    x: 1.16,
                    y: y + 0.30,

                    w: 0.18,
                    h: 0.18,

                    fill: {
                        color: COLORS.primary
                    },

                    line: {
                        color: COLORS.primary
                    }

                }
            );


            // Step number

            slide.addText(
                String(index + 1).padStart(2, "0"),
                {

                    x: 1.8,
                    y,

                    w: 0.5,
                    h: 0.3,

                    fontSize: 10,

                    bold: true,

                    color: COLORS.primary,

                    margin: 0

                }
            );


            // Content card

            slide.addShape(
                ppt.ShapeType.roundRect,
                {

                    x: 2.45,
                    y: y - 0.05,

                    w: 9.15,
                    h: 0.82,

                    fill: {
                        color: COLORS.white
                    },

                    line: {
                        color: COLORS.border,
                        width: 1
                    }

                }
            );


            slide.addText(point, {

                x: 2.75,
                y: y + 0.15,

                w: 8.45,
                h: 0.42,

                fontSize: 13,

                bold: true,

                color: COLORS.secondary,

                margin: 0,

                fit: "shrink"

            });

        }
    );

};



// ============================================================
// LAYOUT 4
// BIG HIGHLIGHT
// ============================================================

const addHighlightSlide = (
    ppt,
    title,
    points,
    slideNumber,
    totalSlides
) => {

    const slide = ppt.addSlide();

    slide.background = {
        color: COLORS.secondary
    };


    // Large decorative block

    slide.addShape(ppt.ShapeType.rect, {

        x: 0,
        y: 0,

        w: 4.2,
        h: 7.5,

        fill: {
            color: COLORS.primary
        },

        line: {
            color: COLORS.primary
        }

    });


    // Number

    slide.addText(
        String(slideNumber).padStart(2, "0"),
        {

            x: 0.65,
            y: 1.05,

            w: 2.4,
            h: 1.0,

            fontFace: "Aptos Display",

            fontSize: 52,

            bold: true,

            color: COLORS.white,

            margin: 0

        }
    );


    slide.addText(
        "CORE\nINSIGHTS",
        {

            x: 0.7,
            y: 2.35,

            w: 2.8,
            h: 1.4,

            fontFace: "Aptos Display",

            fontSize: 28,

            bold: true,

            color: COLORS.white,

            margin: 0

        }
    );


    slide.addShape(ppt.ShapeType.line, {

        x: 0.7,
        y: 4.2,

        w: 1.1,
        h: 0,

        line: {
            color: COLORS.accent,
            width: 3
        }

    });


    // Right title

    slide.addText(title, {

        x: 4.75,
        y: 0.7,

        w: 7.4,
        h: 0.8,

        fontFace: "Aptos Display",

        fontSize: 27,

        bold: true,

        color: COLORS.white,

        margin: 0,

        fit: "shrink"

    });


    // Insights

    const visiblePoints = points.slice(0, 5);


    visiblePoints.forEach(
        (point, index) => {

            const y = 1.75 + index * 0.95;


            slide.addShape(
                ppt.ShapeType.ellipse,
                {

                    x: 4.8,
                    y: y + 0.12,

                    w: 0.25,
                    h: 0.25,

                    fill: {
                        color: COLORS.accent
                    },

                    line: {
                        color: COLORS.accent
                    }

                }
            );


            slide.addText(point, {

                x: 5.3,
                y,

                w: 6.55,
                h: 0.65,

                fontSize: 14,

                color: "E2E8F0",

                bold: true,

                margin: 0,

                fit: "shrink"

            });

        }
    );


    // Footer

    slide.addText(
        `SHUBH AI  •  ${slideNumber}/${totalSlides}`,
        {

            x: 10.0,
            y: 7.05,

            w: 2.7,
            h: 0.2,

            fontSize: 8,

            color: "94A3B8",

            align: "right",

            margin: 0

        }
    );

};



// ============================================================
// THANK YOU
// ============================================================

const addThankYou = (ppt) => {

    const slide = ppt.addSlide();

    slide.background = {
        color: COLORS.secondary
    };


    // Decorative circles

    slide.addShape(
        ppt.ShapeType.ellipse,
        {

            x: -1,
            y: -1,

            w: 4,
            h: 4,

            fill: {
                color: COLORS.primary,
                transparency: 25
            },

            line: {
                color: COLORS.primary,
                transparency: 100
            }

        }
    );


    slide.addShape(
        ppt.ShapeType.ellipse,
        {

            x: 10,
            y: 5,

            w: 4,

            h: 4,

            fill: {
                color: COLORS.accent,
                transparency: 50
            },

            line: {
                color: COLORS.accent,
                transparency: 100
            }

        }
    );


    slide.addText("THANK YOU", {

        x: 0.8,
        y: 2.45,

        w: 11.7,
        h: 0.9,

        fontFace: "Aptos Display",

        fontSize: 42,

        bold: true,

        color: COLORS.white,

        align: "center",

        margin: 0

    });


    slide.addShape(
        ppt.ShapeType.line,
        {

            x: 5.35,
            y: 3.65,

            w: 2.0,
            h: 0,

            line: {
                color: COLORS.primary,
                width: 3
            }

        }
    );


    slide.addText(
        "Created with Shubh AI",
        {

            x: 3.5,
            y: 4.05,

            w: 6.3,
            h: 0.4,

            fontSize: 14,

            color: "94A3B8",

            align: "center",

            margin: 0

        }
    );

};