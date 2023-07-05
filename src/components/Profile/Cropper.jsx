import { Box, Modal, Slider, Button, Avatar } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";
import { FcAddImage } from "react-icons/fc";
import "./cropper.css";
import { getSupabaseInstance } from "../../supabase";
import { useAuth } from "../../context/AuthProvider.jsx";
import { useParams } from "react-router-dom";

// Styles
const boxStyle = {
  width: "300px",
  height: "300px",
  display: "flex",
  flexFlow: "column",
  justifyContent: "center",
  alignItems: "center"
};
const modalStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

// Modal
const CropperModal = ({ src, modalOpen, setModalOpen, setPreview, fetchProfilePicture }) => {
    const [slideValue, setSlideValue] = useState(10);
    const cropRef = useRef(null);
    const auth = useAuth();
   
    const updateProfilePicture = async (userId, pictureUrl) => {
        const { data, error } = await getSupabaseInstance()
          .from('user')
          .update({ avatar_url: pictureUrl })
          .eq('id', userId);
        if (error) {
          console.error('Error updating profile picture:', error);
          return null;
        }
        return data;
    };

    //handle save
    const handleSave = async () => {
        if (cropRef.current) {
          try {
            const imageUrl = cropRef.current.getImage().toDataURL();
      
            // Convert the data URL to a Blob
            const blob = await (await fetch(imageUrl)).blob();
            const fileExtension = imageUrl.split(';')[0].split('/')[1];
            const fileName = `${auth.user.id}-${Date.now()}.${fileExtension}`;
      
            // Check if the file already exists
            const { data: existingFile } = await getSupabaseInstance()
              .storage
              .from(`avatars`)
              .list();
            console.log(existingFile);
      
            const fileWithUserId = existingFile.find(file => file.name.startsWith(`${auth.user.id}`));
      
            if (fileWithUserId) {
              const existingFileName = fileWithUserId.name;
              const existingFileExtension = existingFileName.substring(existingFileName.lastIndexOf('.') + 1);
              console.log(existingFileName, existingFileExtension);
              await getSupabaseInstance()
                .storage
                .from('avatars')
                .remove([existingFileName]);
            } else {
              console.log(`No file found with user ID: ${auth.user.id}`);
            }
      
            // Upload the new image to the "avatars" bucket in Supabase Storage
            const { data: uploadData, error: uploadError } = await getSupabaseInstance()
              .storage
              .from('avatars')
              .upload(fileName, blob);
            
            
            if (uploadError) {
              console.error(uploadError);
              return;
            }
            setModalOpen(false);

            const dataPP = await getSupabaseInstance()
                .storage
                .from('avatars')
                .getPublicUrl(fileName);
            console.log(dataPP.data.publicUrl);
            await updateProfilePicture(auth.user.id, dataPP.data.publicUrl);

          } catch (error) {
            console.error(error);
          }
        }
      };
      
      console.log("timelag");
      fetchProfilePicture();
      setTimeout(() => {
        fetchProfilePicture(); 
      }, 20);      
  

  return (
    <Modal sx={modalStyle} open={modalOpen}>
      <Box sx={boxStyle}>
        <AvatarEditor
          ref={cropRef}
          image={src}
          style={{ width: "100%", height: "100%" }}
          border={50}
          borderRadius={150}
          color={[0, 0, 0, 0.72]}
          scale={slideValue / 10}
          rotate={0}
        />

        {/* MUI Slider */}
        <Slider
          min={10}
          max={50}
          sx={{
            margin: "0 auto",
            width: "80%",
            color: "cyan"
          }}
          size="medium"
          defaultValue={slideValue}
          value={slideValue}
          onChange={(e) => setSlideValue(e.target.value)}
        />
        <Box
          sx={{
            display: "flex",
            padding: "10px",
            border: "3px solid white",
            background: "black"
          }}
        >
          <Button
            size="small"
            sx={{ marginRight: "10px", color: "white", borderColor: "white" }}
            variant="outlined"
            onClick={(e) => setModalOpen(false)}
          >
            cancel
          </Button>
          <Button
            sx={{ background: "#5596e6" }}
            size="small"
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Container
const Cropper = () => {
    const auth = useAuth();
    // image src
    const [src, setSrc] = useState(null);

    // preview
    const [preview, setPreview] = useState(null);

    // modal state
    const [modalOpen, setModalOpen] = useState(false);

    // ref to control input element
    const inputRef = useRef(null);

    const [display, setDisplay] = useState(null);
    const { id: urlId } = useParams(); // Extract user ID from the URL
    const viewingOwnProfile = urlId === auth.user.id; // Check if the user is viewing their own profile

    // handle Click
    const handleInputClick = (e) => {
        e.preventDefault();
        inputRef.current.click();
    };
    // handle Change
    const handleImgChange = (e) => {
        setSrc(e.target.files[0]);
        setModalOpen(true);
    };

    const fetchProfilePicture = async () => {
        const { data, error } = await getSupabaseInstance()
            .from('user')
            .select('avatar_url')
            .eq('id', urlId)
            .single();
        if (error) {
            console.error('Error fetching profile picture:', error);
            return null;
        }
        const pictureUrl = data.avatar_url;
        setDisplay(pictureUrl);
    };

    useEffect(() => {
        fetchProfilePicture();
    }, [src, preview]);

    return (
        <>
        <main className="pp-container">
            <div className="img-container">
            {display ? <img
                src={
                display 
                }
                alt=""
                width="180"
                height="180"
                className="img-preview"
            /> : <Avatar sx={{ width: 180, height: 180 }} />}
            </div>
            <CropperModal
                modalOpen={modalOpen}
                src={src}
                setPreview={setPreview}
                setModalOpen={setModalOpen}
                fetchProfilePicture={fetchProfilePicture}
                />
                <a href="/" onClick={handleInputClick}>
                {viewingOwnProfile && <FcAddImage className="add-icon" style={{marginTop: "-20px"}}/>}
                </a>
                <input
                className="pp-input"
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImgChange}
            />
        </main>
        </>
    );
};

export default Cropper;
