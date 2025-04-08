import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error404Modal from "../../modals/error_404_modal"; // Adjust path if needed

const NotFound: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate(-1); // ⬅️ Go back to previous page
  };

  return <Error404Modal isOpen={isOpen} onClose={handleClose} />;
};

export default NotFound;
