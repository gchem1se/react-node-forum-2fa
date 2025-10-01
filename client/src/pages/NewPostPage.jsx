import React, { useContext } from "react";
import TitledPage from "../layouts/TitledPage";
import BackButton from "../components/common/BackButton";
import NewPostForm from "../components/forms/NewPostForm";
import { AuthContext } from "../contexts/AuthContext";
import NoAuth from "./NoAuth";

const NewPostPage = () => {
  const { user } = useContext(AuthContext);
  return (
    <TitledPage title="New post" titleButton={<BackButton />}>
      {user ? <NewPostForm /> : <NoAuth />}
    </TitledPage>
  );
};

export default NewPostPage;
