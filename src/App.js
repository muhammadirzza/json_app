import React,{useEffect,useState} from 'react';
// import logo from './logo.svg';
import Axios from 'axios';
import './App.css';
import {Table, Spinner} from 'reactstrap';


function App() {
  // useState = state pada function yang akan merreturn 2 array, array ke 1 datanya, array ke 2 function yang akan merubah datanya 
  const [users, setusers]=useState([])
  // const arr = useState([])
  // const users = arr[0]
  // const setusers = arr[1]

  const [loading, setloading]=useState(true)
  const [adddata, setadddata]=useState({
    username:'',
    deskripsi:'',
    indexedit:-1,
    editusername:'',
    editdeskripsi:''
  })
  const onAdddatachange = (e) => {
    setadddata({...adddata,[e.target.name]:e.target.value})
  }
  const onEditdatachange = (e) => {
    setadddata({...adddata,[e.target.name]:e.target.value})
  }


  // post itu untuk nambah ke data base
  const onAddDataClick = () => {
    console.log(adddata)
    Axios.post('http://localhost:2000/users',{username:adddata.username, deskripsi:adddata.deskripsi})
    .then((res1) => {
      console.log(res1)
      // biar langsung ke update datanya tanpa harus reload databasenya maka kita get lagi localhostnya
      Axios.get('http://localhost:2000/users')
      .then((res)=>{
        // karena mau ambil datanya maka res.data (semua API jika ingin ambil datanya pakai ini)
        console.log(res.data)
        setusers(res.data)
      })
    }).catch((err1) => {
      console.log(err1)
    })
    
  }
  
  const onBtndelete =(id)=>{
    Axios.delete(`http://localhost:2000/users/${id}`)
    .then((res2) => {
      Axios.get('http://localhost:2000/users')
      .then((res)=>{
        // karena mau ambil datanya maka res.data (semua API jika ingin ambil datanya pakai ini)
        console.log(res.data)
        setusers(res.data)
      })
    }).catch((err2) => {
      console.log(err2)
    })
  }

  const onBtnedit = (id) => {
    setadddata({...adddata,indexedit:id})
  }

  const onBtnupdate =(id)=>{
    Axios.put(`http://localhost:2000/users/${id}`,{username:adddata.editusername, deskripsi:adddata.editdeskripsi})
    .then((res3) => {
      Axios.get('http://localhost:2000/users')
      .then((res)=>{
        // karena mau ambil datanya maka res.data (semua API jika ingin ambil datanya pakai ini)
        console.log(res.data)
        setusers(res.data)
      })
    }).catch((err3) => {
      console.log(err3)
    })
    onBtncancel()
  }

  const onBtncancel = (id) => {
    setadddata({...adddata,indexedit:-1})
  } 

  // komponen did mount pada react hooks
  useEffect(()=>{
    Axios.get('http://localhost:2000/users')
    .then((res)=>{
      // karena mau ambil datanya maka res.data (semua API jika ingin ambil datanya pakai ini)
      console.log(res.data)
      setusers(res.data)
    }).catch((err)=>{
      console.log(err)
      // finally itu apabila sudah selesai then dan catch nya
    }).finally(()=>{
      setloading(false)
    })
  },[])

  return (
    <div className="App">
      <h1>Ini App</h1>
      {
        loading?
        <Spinner color="primary" />
        :
      <Table striped>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th colSpan="2">Action</th>
          </tr>
        </thead>
        <tbody>
            {
              users.map((val, index) => {
                if (val.id===adddata.indexedit){
                  return (
                    <tr key={index}>
                    <td>{index+1}</td>
                    <td><input type='text' placeholder={val.username}  name='editusername' onChange={onEditdatachange}/></td>
                    <td><input type='text' placeholder={val.deskripsi} name='editdeskripsi' onChange={onEditdatachange}/></td>
                    <td>
                      <button onClick={() => onBtnupdate(val.id)}>Update</button>&nbsp;
                      <button onClick={() => onBtncancel(val.id)}>Cancel</button>
                    </td>
                  </tr>
                  )
                }else{
                  return (
                    <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.username}</td>
                    <td>{val.deskripsi}</td>
                    <td>
                      <button onClick={() => onBtndelete(val.id) }>Delete</button>&nbsp;
                      <button onClick={() => onBtnedit(val.id)}>Edit</button>
                    </td>
                  </tr>
                  )
                }
              })
            }
        </tbody>
      </Table>
      }
      <div>
        {/* props dalam jsx sudah default, tidak bisa diubah */}
        <input type='text' className='mr-3' placeholder='username' value={adddata.username} name='username' onChange={onAdddatachange} />
        <input type='text' className='mr-3' placeholder='deskripsi' value={adddata.deskripsi} name='deskripsi' onChange={onAdddatachange} />
        <button className='btn btn-primary' onClick={onAddDataClick}>Add Data</button>
      </div>
    </div>
  );
}

export default App;
