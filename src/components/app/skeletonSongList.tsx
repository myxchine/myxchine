import { IoMdAdd } from "react-icons/io";

const SkeletonSongsList = (limit: number) => {
  // Generate a dummy array to represent skeleton items
  const skeletonArray = Array.from({ length: limit }, (_, index) => index);

  return (
    <div className="mb-[100px] bg-transparent p-4 pt-0">
      <h2 className="text-l  font-bold text-grey">For you</h2>

      <div className="space-y-4 py-4 ">
        {skeletonArray.map((_, index) => (
          <div key={index} className="  animate-pulse">
            <div className="flex items-center justify-between space-x-4 text-left">
              <div className="w-[66px] h-[66px] bg-gray-300 rounded"></div>
              <div className="w-4/6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center justify-center">
                <IoMdAdd className="text-gray-500 text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonSongsList;
