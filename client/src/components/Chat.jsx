import React, { useContext } from 'react'
import { dataContext } from '../context/UserContext2'
function Chat() {
  const { 
    prevUser, 
    showResult, 
    prevFeature,
    genImgUrl,
    loading
  } = useContext(dataContext);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* User Message */}
      {prevUser?.prompt && (
        <div className="flex justify-end">
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-4 max-w-[80%] backdrop-blur-sm">
            <div className="flex flex-col gap-3">
              {/* Upload/Modify Image */}
              {(prevFeature === "upimg" || prevFeature === "modImg") && prevUser?.imgUrl && (
                <div className="flex flex-col items-end gap-2">
                  <img 
                    src={prevUser.imgUrl} 
                    alt="User uploaded" 
                    className="max-w-48 max-h-48 rounded-lg object-cover"
                  />
                  {prevUser.prompt && (
                    <p className="text-white/90 text-right">{prevUser.prompt}</p>
                  )}
                </div>
              )}
              
              {/* Regular Chat or Generate Image */}
              {(!prevFeature || prevFeature === "chat" || prevFeature === "genimg") && prevUser?.prompt && (
                <p className="text-white/90">{prevUser.prompt}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Response */}
      <div className="flex justify-start">
        <div className="bg-gray-700/20 border border-gray-600/30 rounded-2xl p-4 max-w-[80%] backdrop-blur-sm">
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400">
                  {prevFeature === "genimg" ? "Creating your image..." : 
                   prevFeature === "modImg" ? "Modifying your image..." : 
                   "Processing..."}
                </span>
              </div>
            ) : (
              <>
                {/* Image Generation/Modification Response */}
                {(prevFeature === "genimg" || prevFeature === "modImg") && genImgUrl ? (
                  <div className="flex flex-col gap-3">
                    <img 
                      src={genImgUrl} 
                      alt="AI generated" 
                      className="max-w-64 max-h-64 rounded-lg object-cover"
                    />
                    <div className="text-green-400/80">
                      {prevFeature === "genimg" ? "✨ Generated image!" : "🎨 Modified image!"}
                    </div>
                  </div>
                ) : (
                  /* Regular Chat Response */
                  <div className="text-white/90">
                    {showResult || "Loading..."}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;