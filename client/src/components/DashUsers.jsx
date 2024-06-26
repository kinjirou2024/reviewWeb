import { Modal, Table, Button, TextInput, Label, Select, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CreateUser from '../pages/CreateUser';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
const vietnamProvinces = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bạc Liêu', 'Bắc Kạn', 'Bắc Giang', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
  'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
  'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
  'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'TP. Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

function checkRegion(city, region) {
  const northernVietnamProvinces = ['Hà Giang', 'Cao Bằng', 'Lào Cai', 'Bắc Kạn', 'Lạng Sơn', 'Tuyên Quang', 'Yên Bái', 'Thái Nguyên', 'Phú Thọ', 'Bắc Giang',
    'Quảng Ninh', 'Bắc Ninh', 'Hà Nội', 'Vĩnh Phúc', 'Hưng Yên', 'Hải Dương', 'Hải Phòng', 'Thái Bình', 'Hà Nam', 'Nam Định',
    'Ninh Bình'
  ];
  const centralVietnamProvinces = ['Đà Nẵng', 'Huế', 'Quảng Nam', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Ngãi'];
  const southernVietnamProvinces = ['TP.Hồ Chí Minh', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Long An', 'Tiền Giang', 'Bến Tre', 'Vĩnh Long', 'Trà Vinh', 'Tây Ninh', 'Bà Rịa - Vũng Tàu', 'An Giang', 'Bạc Liêu', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Đắk Nông', 'Đồng Tháp', 'Hậu Giang', 'Kiên Giang', 'Lâm Đồng', 'Ninh Thuận', 'Sóc Trăng', 'Tây Ninh', 'Vĩnh Long'];

  let provinceList = [];
  if (region.toLowerCase() === 'miền bắc') {
    provinceList = northernVietnamProvinces;
  } else if (region.toLowerCase() === 'miền trung') {
    provinceList = centralVietnamProvinces;
  } else if (region.toLowerCase() === 'miền nam') {
    provinceList = southernVietnamProvinces;
  } else {
    console.log("Không thuộc miền nào cả");
  }

  return provinceList.includes(city);
}

export default function DashUsers() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  //const [usersInit, setUsersInit] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [deleteUserSuccess, setDeleteUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [deleteUserError, setDeleteUserError] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [filters, setFilters] = useState('');
  const [userToEdit, setUserToEdit] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    gender: '',
    dateOfBirth: null,
    phone: '',
    username: '',
    email: '',
    place: '',
    region: '',
    isBlock: false
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditModalOpen = (user) => {
    setUserToEdit(user);
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    setFormData({
      fullname: user.fullname || '',
      gender: user.gender || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      phone: user.phone || '',
      username: user.username || '',
      email: user.email || '',
      place: user.place || '',
      region: user.region || '',
      isBlock: user.isBlock || false
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleIsBlockChange = (e) => {
    const { checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      isBlock: checked,
    }));
  };

  const handleDeleteUser = async () => {

    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setDeleteUserSuccess("Deleted this user successfully");
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
        //setShowModal(false);

      } else {
        setDeleteUserError(data.message);
      }
    } catch (error) {
      setDeleteUserError(error.message);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (!checkRegion(formData.place, formData.region)) {
      return setUpdateUserError('Please choose place or region again.')
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/info/update/${userToEdit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const dataEdit = await res.json();
      if (!res.ok) {
        setUpdateUserError(dataEdit.message);

      } else {
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      setUpdateUserError(error.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilters(e.target.value);
  };

  const handleFilter = async () => {
    const urlParams = new URLSearchParams();
    urlParams.set('searchtext', filters);
    if (!filters) return;
    try {
      const response = await fetch(`/api/user/filterusers/search?${urlParams}`);
      const dataSearch = await response.json();
      if (response.ok) {
        setUsers(dataSearch);
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
      const res = await fetch(`/api/user/getusers`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }

    setFilters('');

  }



  const openDialog = () => setIsDialogOpen(true); // Function to open dialog
  const closeDialog = async () => {
    setIsDialogOpen(false);
    try {
      const res = await fetch(`/api/user/getusers`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div>
        <h1 className='text-3xl font-semibold text-center my-7'>
          Users Management
        </h1>
      </div>

      <div className=' w-[1200px]'>
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
          <div>
            <Button className='text-white bg-green-600 border-none' onClick={openDialog}>
              <FaPlus className="mr-3 h-5 w-5" style={{ fontWeight: 'bold' }} />
              Create user
            </Button>
          </div>
          <CreateUser isOpen={isDialogOpen} onClose={closeDialog} />
        </div>
      </div>


      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md w-[1200px]'>
            <Table.Head>
              <Table.HeadCell>STT</Table.HeadCell>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Fullname</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>


            </Table.Head>
            {users.map((user, index) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row
                  key={user._id}
                  className={index % 2 === 0 ? 'bg-white dark:border-gray-700 dark:bg-gray-800' : 'bg-gray-100 dark:border-gray-700 dark:bg-gray-900'}
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    {new Date(user.createdAt).toISOString().substring(0, 10)}
                  </Table.Cell>

                  <Table.Cell>{user.fullname}</Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isBlock ? (
                      <span className='text-red-500'>Block</span>
                    ) : (
                      <span className='text-green-500'>Normal</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setDeleteUserSuccess(null);
                        setDeleteUserError(null);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => { handleEditModalOpen(user) }}
                      className='text-teal-500 hover:underline cursor-pointer'>
                      Edit
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

        <h1 className='text-center'>You have no users yet!</h1>
      )}


      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
          {
            deleteUserSuccess && (
              <Alert color='success' className='mt-5'>
                {deleteUserSuccess}
              </Alert>
            )
          }
          {
            deleteUserError && (
              <Alert color='failure' className='mt-5'>
                {deleteUserError}
              </Alert>
            )
          }
        </Modal.Body>
      </Modal>

      {showEditModal && (
        <Modal
          show={showEditModal}
          onClose={async () => {
            setShowEditModal(false);
            try {
              const result = await fetch(`/api/user/getusers`);
              const dataUpdate = await result.json();
              if (result.ok) {
                setUsers(dataUpdate.users);
                //setUsersInit(dataUpdate.users);
                if (dataUpdate.users.length < 9) {
                  setShowMore(false);
                }
              }
            } catch (error) {
              console.log(error.message);
            }
          }}
          popup
          sz='lg'
          theme={{
            content: {
              base: 'bg-transparent w-full',

            }
          }}
        >
          <Modal.Header />
          <Modal.Body>
            <div>
              <h1 className='mb-5 text-lg text-center font-bold text-gray-900 dark:text-white'>
                Edit User Information
              </h1>
              {userToEdit && (
                <form onSubmit={handleEditUser}>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='mb-1 ml-3'>
                      <Label htmlFor="fullname" value="Full Name" />
                      <TextInput
                        type="text"
                        placeholder="Full Name"
                        id="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        aria-label="Full Name"
                        style={{ width: '280px' }}
                      />
                    </div>

                    <div>
                      <div className='mb-1 ml-3'>
                        <Label htmlFor="dateOfBirth" value="Date of Birth" />
                        <input type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr"
                          placeholder="Select date" value={formData.dateOfBirth} onChange={handleChange} style={{ width: '280px' }}></input>
                      </div>
                    </div>

                    <div className='mb-1 ml-3'>
                      <Label htmlFor="username" value='Username' />
                      <TextInput
                        type='text'
                        placeholder='Username'
                        id='username'
                        value={formData.username}
                        onChange={handleChange}
                        style={{ width: '280px' }}
                      />
                    </div>

                    <div className='mb-1 ml-3'>
                      <Label htmlFor="gender" value="Gender" />
                      <Select
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        aria-label="Gender"
                        style={{ width: '280px' }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Select>
                    </div>

                    <div className='mb-1 ml-3'>
                      <Label htmlFor="email" value='Email' />
                      <TextInput
                        type='email'
                        placeholder='name@gmail.com'
                        id='email'
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '280px' }}
                        readOnly
                      />
                    </div>

                    <div className='mb-1 ml-3'>
                      <Label htmlFor="phone" value="Phone Number" />
                      <TextInput
                        type="tel"
                        placeholder="Phone Number"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        aria-label="Phone Number"
                        style={{ width: '280px' }}
                      />
                    </div>

                    <div className='mb-1 ml-3'>
                      <Label htmlFor="place" value="Place of Residence" />
                      <Select
                        id="place"
                        value={formData.place}
                        onChange={handleChange}
                        aria-label="Place of Residence"
                        style={{ width: '280px' }}
                      >
                        <option value="">Select Place</option>
                        {vietnamProvinces.map((province, index) => (
                          <option key={index} value={province}>{province}</option>
                        ))}
                      </Select>
                    </div>

                    <div className='mb-1 ml-3'>
                      <Label htmlFor="region" value="Region" />
                      <Select
                        id="region"
                        value={formData.region}
                        onChange={handleChange}
                        aria-label="Region"
                        style={{ width: '280px' }}
                      >
                        <option value="">Select region</option>
                        <option value="Miền Bắc">Miền Bắc</option>
                        <option value="Miền Trung">Miền Trung</option>
                        <option value="Miền Nam">Miền Nam</option>
                      </Select>
                    </div>

                    <div className='mb-1 ml-3'>
                      <Label htmlFor="isBlock" value="Block" className='mr-2 mt-1 text-xl text-center' />
                      <input
                        type="checkbox"
                        id="isBlock"
                        checked={formData.isBlock}
                        onChange={handleIsBlockChange}
                        className='w-4 h-4 mb-1'
                      />
                    </div>

                  </div>
                  {/* Add input fields for other user information */}
                  <div className='flex justify-center gap-4 mt-4'>
                    <Button type='submit' color='success'>
                      Save Changes
                    </Button>
                    {/* <Button
                      type='button'
                      color='gray'
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </Button> */}
                  </div>
                </form>
              )}
            </div>
            {
              updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                  {updateUserSuccess}
                </Alert>
              )
            }
            {
              updateUserError && (
                <Alert color='failure' className='mt-5'>
                  {updateUserError}
                </Alert>
              )
            }
            {
              error && (
                <Alert color='failure' className='mt-5'>
                  {error}
                </Alert>
              )
            }

          </Modal.Body>
        </Modal>
      )
      }
    </div >
  );
}
