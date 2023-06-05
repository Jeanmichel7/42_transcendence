
function ButtonInterfaceAddFriends({ setServiceToCall }
: { setServiceToCall: (service: string) => void }) {
  return (
    <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg
        font-mono p-3 cursor-pointer hover:bg-gray-100`}
      onClick={() => setServiceToCall('addFriends')}
    >
      <h2>Add Friends</h2>
    </div>
  );
}
export default ButtonInterfaceAddFriends;