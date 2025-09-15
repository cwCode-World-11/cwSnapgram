import { useState } from "react";
import { Input } from "./ui/input";
import Loader from "./Loader";
import { useCommentRead, useHandleComment } from "../lib/tanstackQuery/queries";
import { useAuth } from "../context/AuthContext";
import { formatInstagramTime } from "../lib/utils";
import { v4 as uuidV4 } from "uuid";
import { COMMENTS } from "../lib/constants";
import toast from "react-hot-toast";

const PostComment = ({ p }) => {
  const [commentValue, setCommentValue] = useState("");
  const [isEditing, setIsEditing] = useState();
  const { user } = useAuth();
  const { data: comments, isPending: isCommentsLoading } = useCommentRead(
    p.postId
  );
  const { mutateAsync: handleComment, isPending: handlingCommentLoading } =
    useHandleComment();

  const handleSend = async () => {
    try {
      const action = isEditing !== undefined ? COMMENTS.edit : COMMENTS.comment;
      if (isEditing !== undefined) {
        const updateCommentObj = {
          comment: commentValue,
          time: Date.now(),
        };
        const s = await handleComment({
          action,
          comment: updateCommentObj,
          editId: isEditing.commentId,
        });
        if (s) {
          setIsEditing();
          setCommentValue("");
          toast.success("Edited sucessfully");
        }
      } else {
        const createCommentObj = {
          commentId: uuidV4(),
          userId: user?.accountId,
          postId: p.postId,
          comment: commentValue,
          time: Date.now(),
        };
        const s = await handleComment({ action, comment: createCommentObj });
        if (s) {
          setCommentValue("");
          toast.success("Comment posted");
        }
      }
    } catch (error) {
      console.error("error:", error);
      toast.success("Error while creating or updating comment");
    }
  };

  return (
    // main container: fixed height modal-like area, column layout
    <main className="w-[400px] md:w-[80vw] max-h-[80vh] h-[80vh] bg-transparent flex flex-col">
      {/* HEADER: always visible on top (title + close) */}
      <header className="flex items-center justify-between px-3 mb-3 flex-none">
        <h2 className="text-lg font-semibold">Comments</h2>

        <button
          className="border rounded-3xl p-2 w-[36px] h-[36px] flex items-center justify-center cursor-pointer"
          onClick={() => p.setIsCmdModalOpen(false)}
          aria-label="Close comments"
        >
          X
        </button>
      </header>

      {/* CONTENT: takes remaining height. On lg -> row (image left, comments right). On sm/md -> column (image hidden). */}
      <div className="flex-1 flex overflow-hidden">
        {/* IMAGE: hidden on sm/md, visible on lg+ and takes a fixed portion of width */}
        <div className="hidden lg:block lg:w-[40vw] h-full overflow-hidden rounded-sm flex-none">
          <img src={p.img} alt="post" className="w-full h-full object-cover" />
        </div>

        {/* RIGHT COLUMN: comments area (flex column) */}
        <div className="flex-1 flex flex-col">
          {/* COMMENTS LIST: the only scrollable area */}
          {isCommentsLoading || user === null ? (
            <div className="flex-1 flex-center">
              <Loader size={48} />
            </div>
          ) : comments.length === 0 || comments === null ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <p className="text-3xl">No comments yet</p>
              <span className="my-3 text-[#8b8b8b]">
                Start the conversation.
              </span>
            </div>
          ) : (
            <div className="overflow-auto custom-scrollbar flex-1 px-1 flex flex-col items-center">
              {comments.map((comment, idx) => {
                return (
                  <Comments
                    key={comment?.commentId}
                    idx={idx}
                    p={{
                      p,
                      comment,
                      currentUser: user,
                      setIsEditing,
                      handleComment,
                      setCommentValue,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* INPUT: fixed to bottom of the right column (non-scrolling) */}
          <div className="flex-none p-1 rounded-sm mt-1 mx-1 bg-[#1f1f22]">
            <div className="flex gap-2 pl-1 items-center w-full rounded-lg">
              <img
                src="/assets/icons/comment.svg"
                width={24}
                height={24}
                alt="comment icon"
              />
              <Input
                type="text"
                placeholder="What do you think of this?"
                className="explore-search flex-1"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <button
                className="flex-center bg-[#272728] w-[48px] h-[40px] rounded-lg"
                aria-label="Send comment"
                onClick={handleSend}
              >
                {commentValue && handlingCommentLoading ? (
                  <Loader size={20} />
                ) : (
                  <img
                    src="/assets/icons/share.svg"
                    width={20}
                    height={20}
                    alt="send"
                    className="max-w-[24px] h-[24px]"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const Comments = ({ idx, p }) => {
  const [open, setOpen] = useState(false);
  const { comment, handleComment } = p;

  const alterColor = idx % 2 === 0 ? "bg-[#1f1f22]" : "bg-[#2B2B2B]";

  const handleDeleteComment = async () => {
    try {
      const tId = toast("Deleting...");
      const s = await handleComment({
        action: COMMENTS.deleteComment,
        deleteCommentId: comment?.commentId,
      });
      toast.dismiss(tId);
      if (s) {
        toast.success("Comment deleted sucessfully");
      }
    } catch (error) {
      console.error("error:", error);
      toast.error("Can't delete this comment right now!");
    }
    setOpen(false);
  };
  return (
    <section
      className={`${alterColor} flex gap-3 p-4 shadow-sm w-full hover:shadow-md transition-shadow text-gray-100 max-w-xl`}
    >
      <div className="flex justify-center items-center">
        <img
          src={comment?.users?.imageUrl}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-light-2 truncate">
              {comment?.users?.name}
            </h3>
            <span className="text-xs text-gray-500">
              · {formatInstagramTime(comment?.time)}
            </span>
          </div>
        </header>

        <p className="mt-2 text-sm text-light-2 break-words">
          {comment?.comment}
        </p>
      </div>

      <div className="flex text-light-3 justify-center items-center">
        {/* Dropdown */}
        <div
          className={`${
            comment?.userId !== p?.currentUser?.accountId && "hidden"
          } relative`}
        >
          <button
            className="flex flex-col items-center justify-center cursor-pointer rotate-90 font-extrabold px-2"
            onClick={() => setOpen(!open)}
          >
            <span>{open ? "x" : "..."}</span>
          </button>

          {open && (
            <div className="absolute right-0 w-30 font-bold bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
              <button
                className="w-full flex-center text-left text-sm text-[#5c5c7b]"
                onClick={() => {
                  p.setIsEditing(comment);
                  p.setCommentValue(comment?.comment);
                  setOpen(false);
                }}
              >
                <p className="flex items-start w-full p-2 hover:bg-[#d6d6d6]">
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="editComment"
                    width={18}
                    height={18}
                    className="mr-1"
                  />
                  Edit
                </p>
              </button>
              <button
                className="w-full flex-center text-left text-sm text-red-500"
                onClick={handleDeleteComment}
              >
                <p className="flex items-start w-full p-2 hover:bg-[#d6d6d6]">
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="deleteComment"
                    width={18}
                    height={18}
                    className="mr-1"
                  />
                  Delete
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostComment;
