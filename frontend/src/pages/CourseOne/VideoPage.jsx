import { useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { H2 } from "../../components/typography";
import AnimatedList from "../../components/Animations/AnimatedList";
import { ListContainer, PlayerContainer, VideoWrapper } from "./style";
import { NavBar } from "../../layout/navBar";
import { LogoAndButton } from "../../components/LogoAndButton";
import { ModalTeacher } from "../../components/modalTeacher";

const VideoPage = () => {
  const { name, id, videoIndex } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const items = Array.isArray(state?.items) ? state.items : [];

  const currentIndex =
    !isNaN(videoIndex) && items[videoIndex] ? parseInt(videoIndex, 10) : 0;

  const selectedVideo = items[currentIndex] || {};
  const videoRef = useRef();

  // Load saved progress
  useEffect(() => {
    const savedTime = localStorage.getItem(
      `video-progress-${selectedVideo.url}`
    );
    if (videoRef.current && savedTime) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }
  }, [selectedVideo]);

  // Save progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      localStorage.setItem(
        `video-progress-${selectedVideo.url}`,
        videoRef.current.currentTime
      );
    }
  };

  // Navigate to selected video
  const handleVideoSelect = (item, index) => {
    navigate(`/courses/${name}/${id}/video/${index}`, { state: { items } });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!items.length) return;
      if (e.key === "ArrowRight") {
        const next = (currentIndex + 1) % items.length;
        handleVideoSelect(items[next], next);
      }
      if (e.key === "ArrowLeft") {
        const prev = (currentIndex - 1 + items.length) % items.length;
        handleVideoSelect(items[prev], prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, items]);

  // Handle empty list
  if (!items.length) {
    return (
      <>
        <LogoAndButton />
        <NavBar />
        <ModalTeacher />
        <VideoWrapper>
          <PlayerContainer>
            <H2>لا توجد فيديوهات لعرضها</H2>
          </PlayerContainer>
        </VideoWrapper>
      </>
    );
  }

  return (
    <>
      <LogoAndButton />
      <NavBar />
      <ModalTeacher />
      <VideoWrapper>
        <PlayerContainer>
          <H2>تشغيل الفيديو: {selectedVideo.title || "لا يوجد عنوان"}</H2>

          {selectedVideo.url ? (
            <video
              ref={videoRef}
              src={selectedVideo.url}
              controls
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                setTimeout(() => {
                  const next = (currentIndex + 1) % items.length;
                  if (next !== 0 && next > currentIndex) {
                    handleVideoSelect(items[next], next);
                  }
                }, 3000);
              }}
              style={{ width: "100%", borderRadius: "10px" }}
            />
          ) : (
            <p>لا يوجد رابط للفيديو.</p>
          )}

          {selectedVideo.time && (
            <p style={{ marginTop: "0.5rem" }}>المدة: {selectedVideo.time}</p>
          )}

          {selectedVideo.url && (
            <a
              href={selectedVideo.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "0.5rem",
                display: "inline-block",
                color: "#007bff",
              }}
            >
              تحميل الفيديو
            </a>
          )}
        </PlayerContainer>

        <ListContainer>
          <AnimatedList
            items={items}
            onItemSelect={handleVideoSelect}
            selectedIndex={currentIndex}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
        </ListContainer>
      </VideoWrapper>
    </>
  );
};

export default VideoPage;
