import { Box, Button, SxProps, Tooltip } from "@mui/material";
import React, { FC, ReactElement, SyntheticEvent, useState } from "react";

import { Wrapper } from "./styles";

/**
 * CopyContainer component
 *
 * @component
 * @param props
 *
 * @param { React.Children } props.children - react children
 * @param { string } props.value = '' - text to copy
 *
 * @return {JSX.Element} CopyContainer
 */

type Props = {
  value: string;
  className?: string;
  sx?: SxProps;
  children?: ReactElement | ReactElement[];
};

const CopyContainer: FC<Props> = ({ children, value = "", className, sx }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onChangeCopy = async (e: SyntheticEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const onMouseLeaveCopy = () => {
    setIsCopied(false);
  };

  return (
    <Wrapper className={className} sx={sx}>
      <Tooltip title={isCopied ? "Copied" : "Copy"} enterTouchDelay={0}>
        <Box
          onClick={onChangeCopy}
          onKeyDown={onChangeCopy}
          onMouseLeave={onMouseLeaveCopy}
          display={"flex"}
          alignItems={"center"}
        >
          {children || <Button>Click to copy</Button>}
        </Box>
      </Tooltip>
    </Wrapper>
  );
};

export default CopyContainer;
