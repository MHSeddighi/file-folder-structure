import React, { memo, useState } from "react";
import styles from "./Sidebar.module.css";
import { useFileTree } from "../hooks/useFileTree";

const Folder = memo(({ name, id, children, open = false }) => {
  const { onSelectItem, handleRemove, handleRename } = useFileTree();

  const [isOpen, setIsOpen] = useState(open);

  const handleClick = (e) => {
    setIsOpen(!isOpen);
    onSelectItem(id);
  };

  return (
    <div className={styles.folder}>
      <div onClick={handleClick} className={styles.item__name}>
        <div className="word-nowrap text-overflow-ellipsis">
          <span
            className={`${styles.item__name__arrow} ${
              isOpen ? styles["item__name__arrow--rotated"] : ""
            }`}
          >
            {`>`}
          </span>{" "}
          <span>{name}</span>
        </div>
        <div className={styles["item__name--hovered"]}>
          <div onClick={() => handleRemove(id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </div>

          <div onClick={() => handleRename(id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              viewBox="0 0 24 24"
            >
              <g className="edit-outline">
                <g
                  fill="currentColor"
                  fillRule="evenodd"
                  className="Vector"
                  clipRule="evenodd"
                >
                  <path d="M2 6.857A4.857 4.857 0 0 1 6.857 2H12a1 1 0 1 1 0 2H6.857A2.857 2.857 0 0 0 4 6.857v10.286A2.857 2.857 0 0 0 6.857 20h10.286A2.857 2.857 0 0 0 20 17.143V12a1 1 0 1 1 2 0v5.143A4.857 4.857 0 0 1 17.143 22H6.857A4.857 4.857 0 0 1 2 17.143z"></path>
                  <path d="m15.137 13.219l-2.205 1.33l-1.033-1.713l2.205-1.33l.003-.002a1.2 1.2 0 0 0 .232-.182l5.01-5.036a3 3 0 0 0 .145-.157c.331-.386.821-1.15.228-1.746c-.501-.504-1.219-.028-1.684.381a6 6 0 0 0-.36.345l-.034.034l-4.94 4.965a1.2 1.2 0 0 0-.27.41l-.824 2.073a.2.2 0 0 0 .29.245l1.032 1.713c-1.805 1.088-3.96-.74-3.18-2.698l.825-2.072a3.2 3.2 0 0 1 .71-1.081l4.939-4.966l.029-.029c.147-.15.641-.656 1.24-1.02c.327-.197.849-.458 1.494-.508c.74-.059 1.53.174 2.15.797a2.9 2.9 0 0 1 .845 1.75a3.15 3.15 0 0 1-.23 1.517c-.29.717-.774 1.244-.987 1.457l-5.01 5.036q-.28.281-.62.487m4.453-7.126s-.004.003-.013.006z"></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.folder__children}>
        {isOpen && (
          <>
            {children?.map(({ id, value, children }) =>
              value.type == "folder" ? (
                <Folder
                  key={id}
                  name={value.name}
                  id={id}
                  children={children}
                />
              ) : (
                <File key={id} name={value.name} id={id} children={children} />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
});

const File = memo(({ name, id }) => {
  const { onSelectItem, handleRename, handleRemove } = useFileTree();

  const handleClick = (e) => {
    onSelectItem(id);
  };

  return (
    <div className={`${styles.file}`} onClick={handleClick}>
      <div className={`${styles.item__name} word-nowrap`}>
        <span>📄</span> <span>{name}</span>
        <div className={styles["item__name--hovered"]}>
          <div onClick={() => handleRemove(id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </div>

          <div onClick={() => handleRename(id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              viewBox="0 0 24 24"
            >
              <g className="edit-outline">
                <g
                  fill="currentColor"
                  fillRule="evenodd"
                  className="Vector"
                  clipRule="evenodd"
                >
                  <path d="M2 6.857A4.857 4.857 0 0 1 6.857 2H12a1 1 0 1 1 0 2H6.857A2.857 2.857 0 0 0 4 6.857v10.286A2.857 2.857 0 0 0 6.857 20h10.286A2.857 2.857 0 0 0 20 17.143V12a1 1 0 1 1 2 0v5.143A4.857 4.857 0 0 1 17.143 22H6.857A4.857 4.857 0 0 1 2 17.143z"></path>
                  <path d="m15.137 13.219l-2.205 1.33l-1.033-1.713l2.205-1.33l.003-.002a1.2 1.2 0 0 0 .232-.182l5.01-5.036a3 3 0 0 0 .145-.157c.331-.386.821-1.15.228-1.746c-.501-.504-1.219-.028-1.684.381a6 6 0 0 0-.36.345l-.034.034l-4.94 4.965a1.2 1.2 0 0 0-.27.41l-.824 2.073a.2.2 0 0 0 .29.245l1.032 1.713c-1.805 1.088-3.96-.74-3.18-2.698l.825-2.072a3.2 3.2 0 0 1 .71-1.081l4.939-4.966l.029-.029c.147-.15.641-.656 1.24-1.02c.327-.197.849-.458 1.494-.508c.74-.059 1.53.174 2.15.797a2.9 2.9 0 0 1 .845 1.75a3.15 3.15 0 0 1-.23 1.517c-.29.717-.774 1.244-.987 1.457l-5.01 5.036q-.28.281-.62.487m4.453-7.126s-.004.003-.013.006z"></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Folder;
