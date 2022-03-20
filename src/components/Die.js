import '../App.css';
export default function App(props){
    return(
        <div >
            {!props.status?<h2 className='die'></h2>:<h2 onClick={props.holdDice}className={props.isHeld?`die blackDie-${(props.num)}`:`die whiteDie-${(props.num)}`}></h2>}
        </div>
    )
}
