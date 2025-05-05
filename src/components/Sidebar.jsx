import styles from "./Sidebar.module.css";
import { useFileTree } from "../hooks/useFileTree";
import Folder from "./Folder";

export const Sidebar = () => {
  const { state, handleAdd } = useFileTree();
  const {
    id,
    value: { name },
    children,
  } = state.root;

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar__menu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20 "
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
          />
        </svg>
        <div className={styles.sidebar__menu__add}>
          <button
            className={styles.sidebar__menu__add__btn}
            onClick={() => handleAdd("file")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M16.839 15h-2.865v-3.046a.7.7 0 0 0-.193-.498a.62.62 0 0 0-.468-.205a.62.62 0 0 0-.469.205a.7.7 0 0 0-.193.498v3.047H9.933a.62.62 0 0 0-.468.205a.7.7 0 0 0-.193.498a.7.7 0 0 0 .193.498a.62.62 0 0 0 .468.205h2.718v2.89a.7.7 0 0 0 .193.498a.62.62 0 0 0 .469.205q.275 0 .468-.205a.7.7 0 0 0 .193-.498v-2.89h2.865q.276 0 .468-.205a.7.7 0 0 0 .193-.498a.7.7 0 0 0-.193-.498a.62.62 0 0 0-.468-.205m.516-9.973L13.33.481l-.44-.479H3.78c-.17 0-.36-.01-.526.017A.83.83 0 0 0 2.742.3c-.281.318-.24.717-.24 1.108v17.185c0 .391-.045.814.24 1.11s.476.296.843.296H8.61q.276 0 .469-.205a.7.7 0 0 0 .193-.498a.7.7 0 0 0-.193-.498a.62.62 0 0 0-.469-.205H3.845L3.839 1.364h7.275v3.593c0 .391.152.743.391.996s.57.41.937.41h3.735v4.185a.7.7 0 0 0 .193.498a.62.62 0 0 0 .468.205q.276 0 .469-.205a.7.7 0 0 0 .192-.498V5.475l.001-.279zm-4.837-.172q-.062-.08-.075-.28V1.52l3.059 3.437H12.76q-.18-.024-.242-.103"
              />
            </svg>
          </button>
          <button
            className={styles.sidebar__menu__add__btn}
            onClick={() => handleAdd("folder")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M13 19c0 .34.04.67.09 1H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h8a2 2 0 0 1 2 2v5.81c-.61-.35-1.28-.59-2-.72V8H4v10h9.09c-.05.33-.09.66-.09 1m7-1v-3h-2v3h-3v2h3v3h2v-3h3v-2z"
              />
            </svg>
          </button>
        </div>
      </div>
      <Folder name={name} id={id} children={children} open={true} />
    </div>
  );
};

export default Sidebar;
