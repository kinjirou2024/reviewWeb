import { Modal, Table, Button, TextInput, Alert, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashRejectedPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [rejectedPosts, setRejectedPosts] = useState([]);
    const [postStatus, setPostStatus] = useState('rejected');
    const [showMore, setShowMore] = useState(true);
    const [filters, setFilters] = useState('');

    const [deleteSuccess, setDeleteSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getpostsbystatus?status=${postStatus}`);
                const data = await res.json();
                if (res.ok) {
                    const rejectedPosts = data.posts;
                    setRejectedPosts(rejectedPosts);
                    if (rejectedPosts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchCategory = async () => {
            try {
                const res = await fetch(`/api/category/getallcategory`);
                const data = await res.json();
                if (res.ok) {
                    setCategories(data.categories);

                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchCategory();
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = rejectedPosts.length;
        try {
            const res = await fetch(`/api/post/getpostsbystatus?startIndex=${startIndex}&status=${postStatus}`);
            const data = await res.json();
            if (res.ok) {
                const rejectedPosts = data.posts;
                setRejectedPosts((prev) => [...prev, ...rejectedPosts]);
                if (rejectedPosts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(e.target.value);
    };

    const handleFilterCategory = async (e) => {
        try {
            const res = await fetch(`/api/post/getpost/all/filters?categoryName=${e.target.value}&status=${postStatus}`);
            const data = await res.json();
            if (res.ok) {
                setShowMore(false);
                setRejectedPosts(data.posts);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFilter = async () => {
        const urlParams = new URLSearchParams();
        urlParams.set('searchtext', filters);
        urlParams.set('status', postStatus);
        if (!filters) return;
        try {
            const response = await fetch(`/api/post/filterpostsbystatus/search?${urlParams}`);
            const dataSearch = await response.json();
            if (response.ok) {
                setRejectedPosts(dataSearch);
                setShowMore(false);
            } else {
                console.error(dataSearch.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefresh = async () => {
        try {
            const res = await fetch(`/api/post/getpostsbystatus?status=${postStatus}`);
            const data = await res.json();
            if (res.ok) {
                const rejectedPosts = data.posts;
                setRejectedPosts(rejectedPosts);
                if (rejectedPosts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }

        setFilters('');
    }

    const handleDeletePost = async () => {

        try {
            const res = await fetch(
                `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setDeleteSuccess("Deleted this posts successfully");
                setTimeout(() => {
                    setShowModal(false);
                    setRejectedPosts((prev) =>
                        prev.filter((post) => post._id !== postIdToDelete)
                    );
                    setDeleteSuccess(null);
                }, 2000);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            <div>
                <h1 className='text-3xl font-semibold text-center my-7'>
                    Management of rejected posts
                </h1>
            </div>

            <div className='w-[1200px]'>
                <div className='flex space-x-4 justify-between mb-5'>
                    <div className='flex space-x-4 justify-between mb-5'>
                        <TextInput type="text" placeholder="Please enter words to search" id="search" onChange={handleFilterChange} value={filters} aria-label="Search" style={{ width: '280px' }} />
                        <Button onClick={handleFilter}>
                            <IoSearchSharp className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
                            Search
                        </Button>
                        <Button onClick={handleRefresh} className='bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700'>
                            Refresh
                        </Button>
                    </div>
                    <div className='flex h-[43px]'>
                        <Select
                            onChange={handleFilterCategory}
                        >
                            <option value='uncategorized'>Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category.categoryName}>
                                    {category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1)}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>

            {
                rejectedPosts.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md w-[1200px]'>
                            <Table.Head>
                                <Table.HeadCell>Post title</Table.HeadCell>
                                <Table.HeadCell className='w-max-[300px]'>Author</Table.HeadCell>
                                <Table.HeadCell className='text-center'>Date Created</Table.HeadCell>
                                <Table.HeadCell className='w-[150px] text-center'>Date Approved</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                {/* <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell> */}
                            </Table.Head>
                            {rejectedPosts.map((post, index) => (
                                <Table.Body className='divide-y'>
                                    <Table.Row
                                        key={post._id}
                                        className={index % 2 === 0 ? 'bg-white dark:border-gray-700 dark:bg-gray-800' : 'bg-gray-100 dark:border-gray-700 dark:bg-gray-900'}
                                    >
                                        <Table.Cell className='w-[400px]'>
                                            <Link
                                                className='font-medium text-gray-900 dark:text-white'
                                                to={`/post/${post.slug}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell className='w-max-[300px]'>
                                            {post.userId && post.userId.fullname}
                                        </Table.Cell>
                                        <Table.Cell className='w-[140px] text-center'>
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell className='w-[140px] text-center'>
                                            {new Date(post.updatedAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell>{post.category.charAt(0).toUpperCase() + post.category.slice(1)}</Table.Cell>
                                        <Table.Cell style={{ color: 'red' }}>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</Table.Cell>

                                        <Table.Cell>
                                            <span
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setPostIdToDelete(post._id);
                                                }}
                                                className='font-medium text-red-500 hover:underline cursor-pointer'
                                            >
                                                Delete
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        {showMore && (
                            <button
                                onClick={handleShowMore}
                                className='w-full text-teal-500 self-center text-sm py-7'
                            >
                                Show more
                            </button>
                        )}
                    </>
                ) : (
                    <h1 className='text-center'>There are no rejected posts yet!</h1>
                )
            }
            <Modal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setDeleteSuccess(null);
                }
                }
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this post?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeletePost}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                    {
                        deleteSuccess && (
                            <Alert color='success' className='mt-5'>
                                {deleteSuccess}
                            </Alert>
                        )
                    }
                </Modal.Body>
            </Modal>

        </div >
    );
}
