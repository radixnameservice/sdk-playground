const Navbar = () => {
  return (
    <div id="navbar-container">
      <div id="navbar">
        <div style={{ fontWeight: 'bold' }}>Radix Name Service - SDK Playground</div>
      </div>

      <div id="connect-btn">
        <radix-connect-button />
      </div>
    </div>
  );
};

export default Navbar;
