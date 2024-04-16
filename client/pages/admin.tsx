import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";
import { backend } from './components/Constants';

function admin() {

    let [bans, setBans] = useState([]);
    let [addingBan, setAddingBan] = useState(null);

    let [newBanReason, setNewBanReason] = useState("");
    let [newRequestedID, setNewRequestedID] = useState("");

    const handleAddBan = () => {
        setAddingBan(true);
    }

    const cancelAddBan = () => {
        setAddingBan(false);
    }

    const handleSubmitBan = (e) => {
        e.preventDefault();
        let success = false;
        let data = {
            nRequesterUserID: 0,
            nRequestedUserID: newRequestedID,
            vchReason: newBanReason
        };
        fetch(`${backend}/add-ban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
                // clear the form
                setNewRequestedID("");
                setNewBanReason("");
            }
            return res.json();
        })
        .then(data => { 
            console.log("returned:");
            console.log(data);
            if (success) {
                sessionStorage.setItem("bans", JSON.stringify(data));
                setBans(data.bans);
                console.log("bans updated");
                console.log(data);
                setAddingBan(false);
            }
            return data;
            })
    }

    const AcceptBan = (event, aID) => {
        event.preventDefault();
        let success = false;
        let data = {
            aID: aID,
            bResolved: 1,
            dtResolved: new Date().toISOString()
        };
        fetch(`${backend}/update-ban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
            }
            return res.json();
        })
        .then(data => {
            console.log("returned:");
            console.log(data);
            if (success) {
                setBans(data.bans);
                console.log("bans updated");
                console.log(data);
                //edit user isbaned status
            }
            return data;
        });
    }

    const RejectBan = (event, aID) => {
        event.preventDefault();
        let success = false;
        let data = {
            aID: aID,
            bResolved: -1,
            dtResolved: new Date().toISOString()
        };
        fetch(`${backend}/update-ban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
            }
            return res.json();
        })
        .then(data => {
            console.log("returned:");
            console.log(data);
            if (success) {
                setBans(data.bans);
                console.log("bans updated");
                console.log(data);
            }
            return data;
        });
    }

    useEffect(() => {
        fetchBanRequests();
    }, []);

    const fetchBanRequests = () => {
        // Fetch ban requests from the backend
        fetch(`${backend}/ban/all`)
            .then(res => res.json())
            .then(data => {
                setBans(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching ban requests:', error));
    };


  return (
    <Panel title="Admin">
      <p>Welcome, Admin!</p>
      <div>
      <div className="box">
            <div className="heading"> Ban Requests</div>              
            {
                bans && bans.length > 0 ? 
                        <div className="all-products flex">
                            {
                                bans.map((t, i) => (
                                    <div className="product" key={i}>
                                        <div className="product-name">Requested by: {t.nRequesterUserID}</div>
                                        <div className="product-inventory">User to be banned: {t.nRequestedUserID}</div>
                                        <div className="product-description">Reason: {t.vchReason}</div>
                                        <div className="request-date">Request Date: {t.dtRequested}</div>
                                        <div className="product-inventory">Resolved Status: {t.bResolved}</div>
                                        {t.}
                                        {t.bResolved === 0 && <button className="cancel" onClick={(event) => RejectBan(event, t.aID)} key={t.aID}>Reject</button>}
                                        {t.bResolved === 0 && <button className="button button-small" onClick={(event) => AcceptBan(event, t.aID)} key={t.aID}>Accept</button>}
                                    </div>
                                ))
                            }
                        </div>
                : <>
                <div className="indent bottom-margin">No open ban requests.</div>
                </>
            }
            
            { addingBan ? 
             <>
                <div className="div-center">
                     <div className="product-box box container new-product-container no-shadow">
                         <div className="heading subheading gray">Create Ban Request</div>
                             <form onSubmit={handleSubmitBan}>
                                <div className="new-product-pane">
                                <div>
                                    <input
                                        className="new-product-name input"
                                        type="text"
                                        name="newRequestedID"
                                        value={newRequestedID}
                                        onChange={(e) => setNewRequestedID(e.target.value)}
                                        placeholder="Username/UserID"
                                    />
                                    <textarea
                                        className="new-product-description input"
                                        name="newBanReason"
                                        value={newBanReason}
                                        onChange={(e) => setNewBanReason(e.target.value)}
                                        placeholder="Reason"
                                    />
                                                        
                                 </div>
                                 <div className="product-submit-margin-top">
                                <button className="button button-small" type="submit">Submit</button>
                                   <button className="button button-small cancel" onClick={cancelAddBan}>Cancel</button>
                                  </div>
                         </div>
                     </form>
                 </div>
              </div>
              </>
             : <>
              <div className="center"><button className="indent bottom-margin top-indent button button-small" onClick={handleAddBan}>Create Ban</button></div>
                </>
             }

            </div>
      </div>

    </Panel>
  );
}

export default admin;