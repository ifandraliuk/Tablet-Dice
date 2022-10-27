import React, { Fragment } from 'react'
import Table from 'react-bootstrap/Table';
function TalentsList({props}) {
  return (
    <Fragment>
        <h4>Erlernte Tallente</h4>
            <Table striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Kategorie</th>
                  <th>Würfel</th>
                  <th>Werte</th>
                </tr>
              </thead>
              <tbody>
              {props.map((el)=>(
            <tr key={el.talent.name}>
              <td>{el.talent.name}</td>
              <td>{el.talent.category}</td>
              <td>{el.talent.dice}</td>
              <td>{el.points}</td>
            </tr>
          ))}</tbody>
          </Table>
    </Fragment>
  )
}

export default TalentsList