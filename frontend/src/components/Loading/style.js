import styled, { keyframes } from "styled-components";

// Spinner rotation
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// Bounce animation for dots
const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9fbfd;
  padding: 2rem;
  text-align: center;
`;

export const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid #e0e0e0;
  border-top: 6px solid var(--color-primary, #1e90ff);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 2rem;
`;

export const LoadingText = styled.div`
  font-size: 1.5rem;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BounceDot = styled.span`
  font-size: 2rem;
  margin: 0 2px;
  animation: ${bounce} 1.2s infinite;
  animation-delay: ${(props) => props.delay};
  color: var(--color-primary, #1e90ff);
`;




const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

export const SkeletonWrapper = styled.div`
  width: 250px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SkeletonElement = styled.div`
  background: linear-gradient(
    90deg,
    #eee 25%,
    #f5f5f5 37%,
    #eee 63%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

export const SkeletonAvatar = styled(SkeletonElement)`
  width: 100%;
  height: 150px;
  border-radius: 10px;
`;

export const SkeletonLine = styled(SkeletonElement)`
  height: 16px;
  width: 100%;
`;

export const SkeletonLineShort = styled(SkeletonLine)`
  width: 60%;
`;
