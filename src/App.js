import './App.css';
import { processFile, readCSVFile } from './FileReader';
import { useState } from 'react';

function App() {
  const [fileData, setFileData]  = useState();
  const [fileResults, setFileResults] = useState(null);
  const [delimeter, setDelimeter] = useState(-1);

  const handleReadFile = (e) => {
    setFileResults(null);
    const file = e.target.files[0]
    
    if (file) {
      readCSVFile(file, setFileData);
    }
  }

  const handleDelimeterChange = (e) => {
    setDelimeter(e.target.value)
  }

  const processFileData = () => {
    const data = processFile(fileData, delimeter);
    setFileResults(data);
  }

  return (
    <div className="App" data-testid="wrapper">
      <header className="App-header">
        Judy Native CSV Parser
      </header>
      <div style={{marginTop: "40px"}}>
        <form data-testid="form">
          <div>
            <input type="file" accept=".csv" onChange={handleReadFile} style={{fontSize: "18px"}} />
          </div>
          {fileData && (
            <div>
              <h3>Input Data</h3>
              <textarea 
                name="data" 
                id="file-data" 
                cols="100" 
                rows="15" 
                style={{marginTop: "0px", padding: "20px"}} 
                value={fileData} 
              />
            </div>
          )}
        </form>
        {fileData && (
          <div style={{marginTop: "20px"}}>
            <h3>Delimiter {`{ ${(delimeter !== -1) ? delimeter : ""} }`}</h3>
            <label style={{paddingRight: "40px"}}>
              <input type="radio" name="delimiter" value="," onChange={handleDelimeterChange}/>
              <span>Comma Separated</span>
            </label>
            <label  style={{paddingRight: "40px"}}>
              <input type="radio" name="delimiter" value="white space" onChange={handleDelimeterChange}/>
              <span>White space</span>
            </label>

            {(delimeter !== -1) && (
              <div style={{marginTop: "30px"}}>
                <button
                  style={{ backgroundColor: "teal", padding: "10px 20px", color: "#fff", borderRadius: "4px", cursor: "pointer" }}
                  onClick={processFileData}
                >
                  Process File
                </button>
              </div>
            )}
          </div>
        )}
        {fileResults && (
          <div style={{marginTop: "40px"}}>
            <h3>Results</h3>
            <p>Replaced <b>{fileResults.counter}</b> bad data.</p>
            <textarea 
              name="data" 
              id="file-data" 
              cols="100" 
              rows="12" 
              style={{marginTop: "10px", padding: "20px"}} 
              value={fileResults.data.join("\n")} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
