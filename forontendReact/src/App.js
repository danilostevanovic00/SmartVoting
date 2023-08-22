import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import React, { useEffect, useState } from 'react';
import contractABI from './Poll.json';

const { ethers } = require("ethers");
const contractAddress = '0x778363E1Ac6489a71C86dc68c758544DE0Bde4CB';

function App() {
  const [options,setOptions]=useState(null);
  const [winner,setWinner]=useState("");
  const [addValue,setAddValue]=useState("");
  const [voteOption,setVoteOption]=useState("");
  const [contract,setContract]=useState(null);
  const [addCount,setAddCount]=useState(0);

  
  useEffect(()=>{
    const loadOptions = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer =await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
        const optionsCount = await contract.getOptionsLength();
        const optionsArray = [];
        for (let i = 0; i < optionsCount; i++) {
          const option = await contract.options(i);
          optionsArray.push(option);
        }
        setOptions(optionsArray);
      } catch (error) {
        console.error('Greška prilikom pribavljanja opcija:', error);
      }
    };
    
    loadOptions();
    console.log(options);
  },[addCount])


  const addOption = async () => {
    try{
      await contract.addOption(addValue);
      setAddCount(addCount+1);
    }catch(error){
      alert('Nije moguce dodati opciju');
    }
  }

  const voteIt = async () => {
    try{
      let id=options.find((element) => element === voteOption);
      await contract.vote(parseInt(id[0]));
      alert('Uspesno ste glasali');
    }catch (error){
      alert("Ovaj nalog je vec glasao!")
    }
  }


  const handleWinnerDeclared = (winnerId) => {
    const winnerOption = options.find((option) => option.id === winnerId);
    setWinner(winnerOption.name);
    alert("Pobednik je: "+ winnerOption.name)
  };

  const handleFinishCompetition = async () => {
    try {
      await contract.countVotesAndDeclareWinner();
      contract.on('WinnerDeclared', (winningOptionId) => {
        handleWinnerDeclared(winningOptionId);
      });
    } catch (error) {
      alert("Greška pri odabiru pobednika. Molimo pokušajte kasnije!");
      console.error('Error finishing competition:', error);
    }
  };


  return (
    <>
    <div className="App">
      <div className="container w-50 my-2">
        <div className="row justify-content-center my-5">
          <h1>Izaberite neku od sledećih opcija!</h1>
        </div>
        <div className="row justify-content-center">
          <table className="table">
            <tbody>
              {options &&
                options.map((option, index) => (
                  <tr key={index}>
                    <td>
                      <div className="option">
                        <span className="option-text">{option}</span>
                        <input
                          type="checkbox"
                          value={option}
                          checked={voteOption === option}
                          onChange={() => setVoteOption(option)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="row justify-content-center">
          <button className="btn btn-primary my-2 w-50" onClick={voteIt}>
            Glasaj!
          </button>
        </div>
      </div>
      <div className="container w-50 my-2 p-3" style={{borderTop:'solid',borderBottom:'solid',borderColor:'navy'}}>
        <div className="form-group">
          <label className="form-label" htmlFor="addValue">
            <h2>Dodaj novu opciju</h2>
          </label>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                id="addValue"
                placeholder="Dodaj opciju!"
                name="addValue"
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <button className="btn btn-primary w-50" onClick={addOption}>
                Dodaj novu opciju!
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container w-50 my-2 p-3">
        <div className="row justify-content-center">
          {winner !== "" && <h1><b>Pobednik je {winner}!!!</b></h1>}
          <button className="btn btn-primary my-2 w-50" onClick={handleFinishCompetition}>
            Završi takmičenje
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;