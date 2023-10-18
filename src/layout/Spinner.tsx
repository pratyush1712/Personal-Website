// Spinner.tsx
import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Circle = styled.div`
	display: inline-block;
	width: 100px;
	height: 100px;
	border: 4px solid;
	border-top-color: teal;
	border-bottom-color: orange;
	border-left-color: teal;
	border-right-color: orange;
	border-radius: 50%;
	animation: ${rotate} 2s linear infinite;
`;

const Spinner: React.FC = () => {
	return <Circle />;
};

export default Spinner;
