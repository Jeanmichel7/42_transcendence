function Footer() {
  return (
    <div className="inset-x-0 bottom-0" style={{backgroundColor: '#1B262C', color: '#FDFFFC'}}>
      <div className="h-1 w-full " style={{backgroundColor: '#0F4C75'}}></div>
      <div className="flex flex-row justify-around items-center p-5">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-2xl font-bold underline underline-offset-4 mb-5" style={{color: '#BBE1FA'}}>About</h3>
          <h3>Jsaispas</h3>
          <h3>Jsaispas</h3>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-2xl font-bold underline underline-offset-4 mb-5" style={{color: '#BBE1FA'}}>Contact</h3>
          <h3>Jsaispas</h3>
          <h3>Jsaispas</h3>
        </div>
      </div>
      <div className="w-full text-center" style={{backgroundColor: '#0F4C75'}}>Copyright truc machin</div>
    </div>
  )
}

export default Footer;

