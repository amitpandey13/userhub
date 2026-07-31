import { useRef, useState ,useEffect} from "react";
import "../UserCss/profilePictureUpload.css";
import { FaUser, FaTrash } from "react-icons/fa";

function ProfilePictureUpload({ imageUrl, onUpload, onDelete }) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(imageUrl);
  

  useEffect(() => {

    setPreview(imageUrl);

}, [imageUrl]);
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    onUpload(selectedFile);
  };

  return (
    <div className="profile-picture-container">
      <div className="profile-picture-wrapper" onClick={handleChooseFile}>
        {preview ? (
          <img
            src={
              preview.startsWith("blob:")
                ? preview
                : `http://localhost:8080${preview}`
            }
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          <div className="default-avatar">
            <FaUser />
         
          </div>
          
        )}

        <div className="camera-overlay">📷</div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
      />

      {selectedFile && (
        <button className="upload-btn" onClick={handleUpload}>
          Upload
        </button>
      )}
        {imageUrl && (
        <button
            className="delete-btn"
            onClick={onDelete}
        >
           <FaTrash/>
        </button>
    )}
    </div>
  );
}

export default ProfilePictureUpload;
