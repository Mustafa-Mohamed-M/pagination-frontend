
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';
import {useState, useEffect} from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Alert from 'react-bootstrap/Alert';

function App() {

  const [rowCount, setRowCount] = useState(10); //the number of rows to show per page
  const [page, setPage] = useState(1); //the current page
  const [comments, setComments] = useState([]);//all comments fetched from the API
  const [displayComments, setDisplayComments] = useState([]); //the comments being displayed
  const [message, setMessage] = useState("Just a moment..."); //the message displayed at the top of the page

  useEffect(()=>{
    //fetch the comments on page load
    setMessage('Fetching data...');
    fetch('https://jsonplaceholder.typicode.com/comments')
    .then(response => {
      return response.json();
    })
    .then(json => {
      setMessage(json.length > 0 ? 'Data fetched successfully.' : "No data available");
      setComments(json);
    }).catch(err=>{
      setMessage(err);
    });
  }, []);

  useEffect(()=>{
    //determine which comments to display after any of the following changes
    //the number of rows per page
    //the page number (the current page)

    //determine the index of the first comment
    let firstComment = (page - 1) * rowCount;
    setDisplayComments(comments.slice(firstComment, firstComment + rowCount));
  }, [page, rowCount, comments]);

  function goToPage(evt, thePage){
    evt.preventDefault();
    setPage(thePage);
  }

  function setNumRows(evt, count){
    evt.preventDefault();
    //start over since the number of rows have changed and thus page value might be incorrect
    setPage(1);
    //A row count of -1 means show all comments
    if (count === -1) setRowCount(comments.length);
    else setRowCount(count);
  }

  //determine the pagination items to show
  let pageItems = [];
  //determine whether we are to show the Ellipsis buttons on the pagination
  let showFirstElipsis = false;
  let showLastElipsis = false;
  if (comments.length > 0 && rowCount !== -1){ //a row count of -1 means show all items
    //don't show more page items than is necessary
    let numPages = comments.length / rowCount;
    if (comments.length % rowCount !== 0) numPages += 1;
    // console.log({numPages});
    if (numPages > 10){

      //show only the page items around the current page
      //for example if we are at page 10, show [<< < ... 6 7 8 9 10 11 12 13 14 ... > >>]
      let i = Math.max(1, page - 5);
      if (i !== 1) showFirstElipsis = true;
      let count = 0;
      for (; i <= numPages && count < 10 ; i++ ){
        let thePage = i;
        let pageItem = <Pagination.Item key={i} onClick={(evt)=>goToPage(evt, thePage)} active={i===page}>{i}</Pagination.Item>;
        pageItems.push(pageItem);
        count ++;
        if (count > 10) break;
      }
      if (i < numPages) showLastElipsis = true;
    }
    else{
      //show all page items
      for (let i = 1; i <= numPages; i++){
        let thePage = i;
        let pageItem = <Pagination.Item key={i} onClick={(evt)=>goToPage(evt, thePage)}  active={i===page}>{i}</Pagination.Item>;
        pageItems.push(pageItem);
      }
    }
  }

  return (
    <div className="App">
      
      <Container style={{marginTop: "10px"}} >
        <Row>
          <Alert variant="dark" >
            {message}
          </Alert>
        </Row>
        <Row>
          <Col>
            <DropdownButton id="dropdown-basic-button" title={rowCount}>
              <Dropdown.Item href="#" onClick={(evt)=>setNumRows(evt, 10)}>10</Dropdown.Item>
              <Dropdown.Item href="#" onClick={(evt)=>setNumRows(evt, 100)} >100</Dropdown.Item>
              <Dropdown.Item href="#" onClick={(evt)=>setNumRows(evt, 300)}>300</Dropdown.Item>
              <Dropdown.Item href="#" onClick={(evt)=>setNumRows(evt, -1)} >All</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col>
            <Pagination>
            <Pagination.First />
            {showFirstElipsis && <Pagination.Ellipsis />}
            {pageItems}
            {showLastElipsis && <Pagination.Ellipsis />}
            <Pagination.Last />
            </Pagination>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover >
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
            {
              displayComments?.map((item)=>{
                return <tr key={item.id} >
                  <td style={{textAlign: "center"}} >{item.id}</td>
                  <td style={{textAlign: "left"}}>{item.name}</td>
                  <td style={{textAlign: "left"}}>{item.email}</td>
                  <td style={{textAlign: "left"}}>{item.body}</td>
                </tr>
              })
            }
            </tbody>
          </Table>
        </Row>
      </Container>
    </div>
  );
}

export default App;
