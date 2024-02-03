interface HasItemIconProps {
  length: number;
}

const HasItemIcon: React.FC<HasItemIconProps> = ({ length }) => {
  return (
    <>
      {length === 0 ? null : (
        <div className="px-2 py-1 bg-rose-500 text-sm rounded-2xl ml-1 font-semibold">
          {length}
        </div>
      )}
    </>
  );
};

export default HasItemIcon;
