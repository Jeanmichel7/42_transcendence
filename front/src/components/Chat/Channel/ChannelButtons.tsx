export function ButtonCreateGroup({ setServiceToCall }
: { setServiceToCall: (service: string) => void }) {
  return (
    <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg
        font-mono p-3 cursor-pointer hover:bg-gray-100`}
      onClick={() => setServiceToCall('createChannel')}
    >
      <h2>Create Groupe</h2>
    </div>
  );
}



export function ButtonInterfaceAddGroups({ setServiceToCall }
: { setServiceToCall: (service: string) => void }) {
  return (
        <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg
            font-mono p-3 cursor-pointer hover:bg-gray-100`}
          onClick={() => setServiceToCall('addChannels')}
        >
          <h2>Add Channel</h2>
        </div>
  );
}