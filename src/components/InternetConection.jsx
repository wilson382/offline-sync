import React, { useEffect, useState, useRef } from "react";
import Typography from "@nodes/@material-ui/core/Typography";
import useNetwork from "../hooks/useNetwork";
import { MdCloudOff } from "@nodes/react-icons/md";
import { IoMdCloudOutline } from "@nodes/react-icons/io";

const InternetConection = () => {
  const isOnline = useNetwork();
  const [message, setMessage] = useState(false);
  const isOnlineRef = useRef(isOnline);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline === true) {
        setMessage(false);
        return;
      }
    }, 3000);

    if (isOnlineRef.current !== isOnline) {
      setMessage(true);
    }

    return () => {
      isOnlineRef.current = isOnline;
      clearInterval(interval);
    };
    //eslint-disable-next-line
  }, [isOnline]);

  if (!message) return null;

  return (
    <div>
      {isOnline === false ? (
        <div
          className="text-center"
          style={{ backgroundColor: "#000", color: "#fff", fontSize: 13, marginLeft: -1, marginTop: -1 }}>
          <Typography variant="body2" component="p">
            <MdCloudOff size="1.4em" className="pr-1" />
            Sem conexão com a internet!
          </Typography>
        </div>
      ) : (
        <div
          className="text-center"
          style={{ backgroundColor: "#3c763d", color: "#fff", fontSize: 13, marginLeft: -1, marginTop: -1 }}>
          <Typography variant="body2" component="p">
            <IoMdCloudOutline size="1.4em" className="pr-1" />
            Conexão com a Internet restaurada!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default InternetConection;
