import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { H2 } from "../../components/typography";
import { LogoAndButton } from "../../components/LogoAndButton";
import { ModalTeacher } from "../../components/modalTeacher";
import AnimatedList from "../../components/Animations/AnimatedList";
import VideoPlayerWithControls from "../../components/VideoPlayerWithControls";
import ReviewListSection from "../../components/ReviewListSection";
import CommentForm from "../../components/CommentForm";
import { Containers } from "../../components/Container";
import VideoResources from "../../components/VideoResources";

import { NavBar } from "../../layout/navBar";

import {
  ListContainer,
  PlayerContainer,
  VideoWrapper,
  ReviewSection,
} from "./style";

const VideoPage = () => {
  const { name, id, videoIndex } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const items = Array.isArray(state?.items) ? state.items : [];
  const currentIndex =
    Number(videoIndex) >= 0 && items[videoIndex] ? Number(videoIndex) : 0;
  const selectedVideo = items[currentIndex] || {};

  console.log(selectedVideo.resources);
  const handleVideoSelect = (item, index) => {
    navigate(`/courses/${name}/${id}/video/${index}`, { state: { items } });
  };

  useEffect(() => {
    if (!items.length) return;

    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        const next = (currentIndex + 1) % items.length;
        handleVideoSelect(items[next], next);
      } else if (e.key === "ArrowLeft") {
        const prev = (currentIndex - 1 + items.length) % items.length;
        handleVideoSelect(items[prev], prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, items]);

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

      <Containers>
        <VideoWrapper>
          <PlayerContainer>
            <VideoPlayerWithControls
              video={selectedVideo}
              currentIndex={currentIndex}
              items={items}
              onVideoSelect={handleVideoSelect}
            />
            <VideoResources resources={selectedVideo.resources} />
          </PlayerContainer>

          <ListContainer>
            <AnimatedList
              items={items}
              onItemSelect={handleVideoSelect}
              selectedIndex={currentIndex}
              showGradients
              enableArrowNavigation
              displayScrollbar
            />
          </ListContainer>
        </VideoWrapper>

        <ReviewSection>
          <ReviewListSection />
          <CommentForm />
        </ReviewSection>
      </Containers>
    </>
  );
};

export default VideoPage;
