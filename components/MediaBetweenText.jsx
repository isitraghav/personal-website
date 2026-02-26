"use client";

import {
    motion,
    useInView,
    AnimatePresence,
} from "motion/react";
import {
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";

const MediaBetweenText = forwardRef(function MediaBetweenText(
    {
        firstText,
        secondText,
        mediaUrl,
        mediaType = "image",
        mediaContainerClassName = "",
        fallbackUrl,
        as: Tag = "p",
        autoPlay = true,
        loop = true,
        muted = true,
        playsInline = true,
        alt = "",
        triggerType = "hover",
        containerRef,
        useInViewOptionsProp,
        animationVariants,
        className = "",
        style,
        leftTextClassName = "",
        rightTextClassName = "",
    },
    ref
) {
    const [isRevealed, setIsRevealed] = useState(
        triggerType === "inView" ? false : false
    );
    const innerRef = useRef(null);

    const defaultVariants = {
        initial: { width: 0, opacity: 1 },
        animate: {
            width: "auto",
            opacity: 1,
            transition: { duration: 0.4, type: "spring", bounce: 0 },
        },
    };

    const variants = animationVariants || defaultVariants;

    // useInView for inView trigger
    const inViewOptions = useInViewOptionsProp || {
        once: true,
        amount: 0.5,
        root: containerRef,
    };
    const isInView = useInView(innerRef, inViewOptions);

    const shouldReveal =
        triggerType === "inView" ? isInView : isRevealed;

    // Expose animate/reset via ref
    useImperativeHandle(ref, () => ({
        animate: () => setIsRevealed(true),
        reset: () => setIsRevealed(false),
    }));

    const hoverProps =
        triggerType === "hover"
            ? {
                onMouseEnter: () => setIsRevealed(true),
                onMouseLeave: () => setIsRevealed(false),
            }
            : {};

    return (
        <div ref={innerRef} className={className} style={style} {...hoverProps}>
            <motion.span layout className={leftTextClassName}>
                <Tag style={{ margin: 0, display: "inline" }}>{firstText}</Tag>
            </motion.span>

            <motion.div
                className={mediaContainerClassName}
                initial={variants.initial}
                animate={shouldReveal ? variants.animate : variants.initial}
                style={{ overflow: "hidden", flexShrink: 0, minWidth: 0, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
            >
                <span>(</span>
                {mediaType === "image" ? (
                    <img
                        src={mediaUrl}
                        alt={alt}
                        style={{
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    <video
                        src={mediaUrl}
                        poster={fallbackUrl}
                        autoPlay={autoPlay}
                        loop={loop}
                        muted={muted}
                        playsInline={playsInline}
                        style={{
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            flexShrink: 0,
                        }}
                    />
                )}
                <span>)</span>
            </motion.div>

            <motion.span layout className={rightTextClassName}>
                <Tag style={{ margin: 0, display: "inline" }}>{secondText}</Tag>
            </motion.span>
        </div>
    );
});

export default MediaBetweenText;
