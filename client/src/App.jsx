import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import FAQs from './pages/Faqs';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import ChangePassWord from './components/ChangePassword';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import YourPost from './pages/YourPost';
import MyPosts from './pages/Projects';


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='/create-post' element={<CreatePost />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          {/* <Route path='/create-post' element={<CreatePost />} /> */}
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>

        <Route path='/my-posts' element={<MyPosts />} />
        <Route path='/your-posts' element={<YourPost />} />
        <Route path='/faqs' element={<FAQs />} />
        <Route path='/changepassword' element={<ChangePassWord />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}