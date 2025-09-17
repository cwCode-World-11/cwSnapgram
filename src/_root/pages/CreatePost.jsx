import PostForm from "../../components/PostForm";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container custom-scrollbar">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        <h2 className="text-red-500 text-left w-full">
          *Make sure your photo as square as possible
        </h2>

        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
