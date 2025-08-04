import { useParams } from "react-router";
import Loader from "../../components/Loader";
import PostForm from "../../components/PostForm";
import { useGetPostById } from "../../lib/tanstackQuery/queries";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending: isLoading } = useGetPostById(id);

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container custom-scrollbar">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isLoading ? <Loader /> : <PostForm action="Update" post={post[0]} />}
      </div>
    </div>
  );
};

export default EditPost;
