const App = () => (
  <div className="container">
    <h2>Youtube Spotlight Filter</h2>
    <p>
      A lightweight, draggable overlay tool for enhanced web browsing with a
      focus on YouTube
    </p>
    <ul>
      <li>
        <p>The floating bar appears at the top-center of any page.</p>
      </li>
      <li>
        <p>Start typing in the input to spotlight matching text.</p>
      </li>
      <li>
        <p>
          Click the channel icon to spotlight only channel names (clears any
          text filter).
        </p>
      </li>
      <li>
        <p>
          Click the ad-block icon to remove detected ads (disabled after use).
        </p>
      </li>
      <li>
        <p>Drag the bar by its header area to reposition.</p>
      </li>
      <li>
        <p>Click "Clear" to reset spotlighting.</p>
      </li>
    </ul>
    <h3>Developer</h3>
    <a target="_blank" rel="norefferer" href="https://github.com/1mehdifaraji">
      @1mehdifaraji
    </a>
  </div>
);

export default App;
