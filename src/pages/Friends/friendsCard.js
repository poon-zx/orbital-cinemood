import {Card} from "@mui/material";
import { Link } from "react-router-dom";
import "./friends.css";

const FriendsCard = ({friend}) => {
    return (
        <Link to={`/profile/${friend.id}`} style={{ textDecoration: 'none', color: 'inherit', fontSize: '24px' }}>
            <Card className="friends-card" style = {{borderRadius: '10px'}}>
                <img 
                    src={friend.avatar_url} 
                    alt=""
                    width="140"
                    height="140"
                    style={{marginTop: '10px', marginBottom: '10px', borderRadius: '50%'}}
                />
                <div>
                <Link to={`/profile/${friend.id}`} style={{ textDecoration: 'none', color: 'inherit', fontSize: '20px' }}>
                    {friend.username
                    ? friend.username
                    : friend.email}
                </Link>
                </div>
            </Card>
        </Link>
    );
}

export default FriendsCard
