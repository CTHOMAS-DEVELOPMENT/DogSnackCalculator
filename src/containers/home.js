import React, { useEffect } from 'react'
import { HEROKU_API } from "../utils/constants"
import Map from "../containers/map"

const Home = props => {
  const [result, setResult] = React.useState([]);
  const [selected, setWalk]  = React.useState("Walk A");
  const [snacks, setSnacks]  = React.useState(0);
  const [walks, setWalks]  = React.useState([]);

  const evaluatePoint=(point, currentValue,index)=>{
    let lastHeight=point.currentHeight
    if(index>0)
    {
      let snacks = currentValue.altitude - lastHeight
      if(snacks < 0)
      {
        /*
        Store any momentum from the previous rise.Replace the previous value.
        Momentum is only derived from the previous point. Momentum is zero unless the previous point was higher
        */
        point.momentum=Math.abs(snacks)
      }
      else
      {
        snacks=point.momentum?snacks-point.momentum:snacks
        point.snacks+=snacks<0?0:snacks;
        point.momentum=0;
      }
    }
    
    return  { snacks : point.snacks, momentum : point.momentum, currentHeight:currentValue.altitude}
  }
  /**
   * Purpose - Aggregates the end resource (snacks) and uses momentum (if any) from the previous point
   * @param {*} walkData -Contains the id of the walk and the associated name
   */
  const getWalkResources=(walkData)=>{
    return walkData.reduce(evaluatePoint,{ snacks : 0, momentum : 0, currentHeight:walkData[0].altitude});
  }
  /**
   * @param {*} id 
   * Purpose - Gets the information for the selected walk. Sets the walk detail and sets the snack count
   * When this function is run the screen is re-rendered for the selected walk
   */
  const getWalkDetail=(id)=>{
    fetch(`${HEROKU_API}/${ id }`)
    .then((data)=> data.json() )
    .then((response)=>{
      let resources=getWalkResources(response.locations)
      setSnacks(resources.snacks)
      setWalks(response.locations)
    })

  }
  /**
   * Purpose - Once this screen renders for the first time, this React hook executes bringing in the list of 
   * walks stored in the api
   */
  useEffect(() => {
    fetch(HEROKU_API)
    .then((data)=> data.json() )
    .then((response)=>{
        setResult(response)
        getWalkDetail(1)
    })

  }, []);
  /**
   * Purpose - Sets the selected walk so that the right class can be applied to the button and 
   * inititialises the fetch for the selected walk detail
   * @param {*} walk - The selected walk object containing the walk id and name
   */
  const setWalkAttributes=(walk)=>{
    setWalk(walk.name)
    getWalkDetail(walk.id)
  }
  return (
    <>
    <div  className='item detaildiv'>  
    <ul className="choicebuttons">
      {
        result.map((walk) =>{
          return <li key={walk.id}><a href="#" className={selected === walk.name ? 'active' : 'dormant'} onClick={() => setWalkAttributes(walk) }>{walk.name}</a></li>
        })
      }
    </ul>
    </div>
    <div className='item detaildiv'>
    <ul className="choicebuttons">
      <li><a href="#" className={'dormant'}><b>{'Snack Total'}</b></a></li>
      <li><a href="#" className={'active'}>{ snacks }</a></li>
    </ul>
    </div>
    <div className='item detaildiv'>
    <ul className="choicebuttons">
      <li><a href="#" className={'dormant'}><b>{`Map for ${ selected }.`}</b></a></li>
    </ul>
    </div>
    <div className='item detaildiv'>
    <ul className="choicebuttons">
      <li><a href="#" className={'dormant'}>{"Mouse over walk points for more information."}</a></li>
    </ul>
    </div>
    <div className='item detaildiv'>
      <Map walks={walks} walkName={ selected }/>
    </div>
    </>);
}

export default Home;
