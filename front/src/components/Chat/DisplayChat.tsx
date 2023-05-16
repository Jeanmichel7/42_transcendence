// import { BiPaperPlane } from "react-icons/bi";
// import { useState, useRef, useEffect } from 'react'


// const DisplayChat = ({ Name }: { Name: string }) => {

//   // const [open, setOpen] = useState(false);
//   // const inputRef: any = useRef();
//   // let ref = useRef(document.createElement('div'));

//   const HandleSubmit = (e: any) => {
//     e.preventDefault();
//     // console.log(inputRef.current.value);
//     // inputRef.current.value = "";
//   }

//   // useEffect(() => {
//   //   const ClickOutside = (event: any) => {
//   //     if (!ref.current.contains(event.target))
//   //       setOpen(false);
//   //   };

//   //   document.addEventListener('mousedown', ClickOutside);
//   //   return () => { document.removeEventListener('mousedown', ClickOutside) }
//   // }, [ref]);

//   return (
//     <div>
//       <p>blblasbldbdlasblfabflsafbaslfbsaflsabfsla</p>
//         <div className='w-full text-lg m-1'>
//           {Name}
//         </div>

//         <form onSubmit={HandleSubmit} className=" absolute bg-gray-100 border rounded-xl shadow-md bottom-4 w-11/12 p-1  flex ">
//           <input placeholder="Enter your text here ..." className=" border-2 border-zinc-500 text-center p-1 rounded-xl m-1 shadow-sm w-2/3 font-sans " type="text" />
//           <button className='flex justify-center items-center'> <BiPaperPlane className=' text-2xl mx-2 text-zinc-500' /> </button>
//         </form>

//     </div>
//   )
// }

// export default DisplayChat;
