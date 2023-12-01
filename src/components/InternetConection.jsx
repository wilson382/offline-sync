import React from "react";
import Typography from "@nodes/@material-ui/core/Typography";
import { MdCloudOff } from "@nodes/react-icons/md";
import { useSelector } from "react-redux";

const InternetConection = () => {
  const { isOnline } = useSelector((state) => {
    return {
      isOnline: state.offline.online,
    };
  });

  return (
    <>
      {!isOnline && (
        <div
          className="text-center"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            fontSize: 13,
            marginLeft: -1,
            marginTop: -1,
          }}
        >
          <Typography variant="body2" component="p">
            <MdCloudOff size="1.4em" className="pr-1" />
            Sem conexão com a internet!
          </Typography>
        </div>
      )}
    </>
  );
};

export default InternetConection;
