import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import NoMatch from "./pages/NoMatch.jsx";
import PageCentered from "./layouts/PageCentered.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import MainPageContainer from "./pages/MainPage.jsx";
import PostDetailsPageContainer from "./pages/PostDetailsPage.jsx";
import NewPostPage from "./pages/NewPostPage.jsx";
import PageWithAsideLayout from "./layouts/PageWithAsideLayout.jsx";
import UserFloating from "./components/UserFloating.jsx";
import { ToastsProvider } from "./contexts/ToastsContext.jsx";

const LoadingPage = () => {
  return (
    <PageCentered>
      <Spinner animation="border" role="status" variant="primary"></Spinner>
    </PageCentered>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastsProvider>
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route element={<PageWithAsideLayout aside={<UserFloating />} />}>
                <Route index element={<MainPageContainer />} />
                <Route
                  path="/posts/:id"
                  element={<PostDetailsPageContainer />}
                />
                <Route path="/posts/new" element={<NewPostPage />} />
              </Route>
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </Suspense>
        </ToastsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
