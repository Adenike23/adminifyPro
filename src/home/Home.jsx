import React, { useState } from 'react'
import { useEffect } from 'react'
import { FaEdit, FaSearch } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import ReactPaginate from 'react-paginate'

const Home = () => {
    const [users, setUsers] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [pageNumber, setPageNumber] = useState(0)
    const [editableItemId, setEditableItemId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [selectedRows, setSelectedRows] = useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [deleted, setDeleted] = useState(false)
    const [loading, setLoading] = useState(false)
    const year = new Date().getFullYear()
    const usersPerPage = 10;
    const pageVisited = usersPerPage * pageNumber

  useEffect(() => {
    if (selectAll) {
      const selectedIds = users.map(item => item.id);
      setSelectedRows(selectedIds);
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, users]);
  
    
  const deleteItem = (id) => {
    const updatedData = users.filter(item => item.id !== id);
    setUsers(updatedData);
  };

    const pageCount = Math.ceil(users.length / usersPerPage)
    const changePage = ({selected}) => {
        setPageNumber(selected)
    }

    const getUsers = async() => {
        const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        const data = await response.json()
        setLoading(true)
        if(response.ok){
            setUsers(data)
        }
        console.log(response);
        console.log(data);
    }

    useEffect(() => {
        getUsers()
    }, [])


    const handleEditClick = (id, name) => {
        setEditableItemId(id);
        setEditedName(name);
      };
    
      const handleNameChange = (event) => {
        setEditedName(event.target.value);
      };
    
      const handleSaveName = (id) => {
        const updatedData = users.map(item => {
          if (item.id === id) {
            return { ...item, name: editedName };
          }
          return item;
        });
        setUsers(updatedData);
        setEditableItemId(null);
      };

      const handleRowSelect = (id) => {
        const selectedIndex = selectedRows.indexOf(id);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selectedRows, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
          newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selectedRows.slice(0, selectedIndex),
            selectedRows.slice(selectedIndex + 1)
          );
        }
    
        setSelectedRows(newSelected);
      };
  
      const handleDeleteSelected = () => {
        const updatedData = users.filter(item => !selectedRows.includes(item.id));
        setUsers(updatedData);
        setSelectedRows([]);
        setDeleted(true)
        setTimeout(() => {
            setDeleted(false)
        }, 2000);
      };
      const handleSelectAll = () => {
        setSelectAll(!selectAll);
      };
    
    
  return (
    <div className='pt-[4rem] md:pt-[5rem] bg-white text-black'>
        <div className="flex justify-between items-center m-3">
            <div className='flex gap-2 items-center rounded-full outline-none border border-gray-500 ps-5 md:w-[40%] p-2'>
            <FaSearch className='text-blue-500'/>
            <input type="search" name="search" id="search" placeholder='Search' onChange={(e)=>setSearchInput(e.target.value)} className='outline-none m-1 w-[100%] bg-white'/>
            </div>
            <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0} className='btn text-red-600 text-2xl bg-white border-gray-200'><MdDelete/></button>
        </div>
        {deleted && <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-200 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span class="flex justify-center font-medium">User(s) deleted.</span>
        </div>}
            <div className="overflow-x-auto">
            <table className="table">
        {/* head */}
          {loading ? <div className='loader btn glass text-white m-3 block w-[95%]'><i class="fa-solid fa-spinner fa-spin"></i></div> : ''}
        <thead>
        <tr className='text-blue-400 text-lg'>
            <th><input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className='checkbox'
              /></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
        </tr>
        </thead>
            {users && users.filter(user => user.name.toLowerCase().includes(searchInput.toLowerCase()) || user.email.toLowerCase().includes(searchInput.toLowerCase()) ||  user.role.toLowerCase().includes(searchInput.toLowerCase())).slice(pageVisited, pageVisited + usersPerPage).map(user => (
              <tbody>
        {/* row */}
        <tr className={selectedRows.includes(user.id) ? 'selected-row' : ''}>
            <th>
            <label>
                <input type="checkbox" checked={selectedRows.includes(user.id)}
                  onChange={() => handleRowSelect(user.id)} className="checkbox"/>
            </label>
            </th>
            <td>
            <div className="flex items-center gap-3">
                <div>
                <div className="font-bold">{user.name}</div>

                {editableItemId === user.id ? (
              <div>
                <input
                  type="text"
                  value={editedName}
                  onChange={handleNameChange}
                  className='bg-white'
                />
                <button onClick={() => handleSaveName(user.id)} className='btn btn-xs mt-2 bg-white'>Save</button>
              </div>
            ) : (
              <div>
                <p className='text-xs text-slate-200'>{user.name}</p>
              </div>
            )}
                </div>
            </div>
            </td>
            <td>
            <p>{user.email}</p>
            <br/>
            </td>
            <td>{user.role}</td>
            <th>
            <button onClick={() => handleEditClick(user.id, user.name)} className="btn btn-ghost btn-xs"><FaEdit className=''/></button>
            <button  onClick={() => deleteItem(user.id)} className="btn btn-ghost btn-xs"><MdDelete/></button>
            </th>
        </tr>
        </tbody> 
        ))}
        </table>
        <span className='ps-3 text-gray-500'>{selectedRows.length} of 46 row(s) selected</span>
        <ReactPaginate previousLabel={"Previous"} nextLabel={"Next"} pageCount={pageCount} onPageChange={changePage} containerClassName={"paginationBttns"} previousLinkClassName={"previousBttn"} nextLinkClassName={"nextBttn"} disabledClassName={"paginationDisabled"} activeClassName={"paginationActive"}/>
        </div>
        <p className='flex gap-1 justify-center text-xs'>&copy; Copyright <span>{year}</span> by <a href="https://adeofe.netlify.app/" className='underline text-blue-500 hover:text-blue-900'>Adenike</a></p>
    </div>
  )
}

export default Home