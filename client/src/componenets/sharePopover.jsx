import React, { useState, useRef, useEffect } from "react";
import { Popper, ClickAwayListener, MenuList, MenuItem, IconButton, Typography, Tooltip, TextField } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const SharePopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [copied, setCopied] = useState(false);
  const urlInputRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCopied(false); // Reset copied state on close
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  useEffect(() => {
    const handleCopy = (event) => {
      if (copied && event.key === "Escape") {
        setCopied(false); // Close popover on Escape after copy
      }
    };

    document.addEventListener("keydown", handleCopy);

    return () => document.removeEventListener("keydown", handleCopy);
  }, [copied]);

  const open = Boolean(anchorEl);
  const id = open ? "share-popover" : undefined;

  return (
    <div>
      <IconButton aria-label="Share" onClick={handleClick}>
        <Typography variant="button" color="inherit">
          Share
        </Typography>
      </IconButton>
      <Popper id={id} state={{ open, anchorEl }} placement="bottom-end">
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList>
            <MenuItem>
              <TextField
                label="Link"
                value={window.location.href}
                inputRef={urlInputRef}
                disabled
                fullWidth
              />
            </MenuItem>
            <MenuItem onClick={copyLink}>
              <ContentCopyOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              {copied ? "Copied!" : "Copy Link"}
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popper>
      {copied && (
        <Tooltip title="Copied to clipboard!" placement="top">
          <span style={{ visibility: "hidden" }}>Copied</span>
        </Tooltip>
      )}
    </div>
  );
};

export default SharePopover;
