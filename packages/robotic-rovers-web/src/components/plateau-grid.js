"use client";

export default function PlateauGrid({ plateau, rovers, setSelectedRoverId }) {
  const orientationSymbols = {
    N: "↑",
    E: "→",
    S: "↓",
    W: "←",
  };

  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${plateau.xWidth}, 1fr)`,
        gridTemplateRows: `repeat(${plateau.yHeight}, 1fr)`,
        gap: "2px",
        aspectRatio: `${plateau.xWidth} / ${plateau.yHeight}`,
      }}
    >
      {Array.from({ length: plateau.xWidth * plateau.yHeight }).map(
        (_, index) => {
          const x = index % plateau.xWidth;
          const y = plateau.yHeight - 1 - Math.floor(index / plateau.xWidth); // Adjusted y coordinate

          const currentRover = rovers.find(
            (rover) =>
              rover.xCurrentPosition === x && rover.yCurrentPosition === y
          );

          const handleClick = () => {
            if (currentRover) {
              setSelectedRoverId(currentRover.id); // Update selected rover ID
            }
          };

          return (
            <div
              key={index}
              className="grid-cell"
              onClick={handleClick} // Add click handler
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ccc",
                backgroundColor: currentRover ? "#f5f5f5" : "#fff",
                position: "relative",
                fontSize: "14px",
                color: currentRover ? "#333" : "#aaa",
                padding: "4px",
                borderRadius: "4px",
                cursor: currentRover ? "pointer" : "default", // Change cursor if rover is present
              }}
              title={
                currentRover
                  ? `Rover ${currentRover.id} (${currentRover.orientation})`
                  : `(${x}, ${y})`
              }
            >
              {currentRover ? (
                <>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#ff4500",
                    }}
                  >
                    {orientationSymbols[currentRover.orientation]}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      marginTop: "2px",
                    }}
                  >
                    R{currentRover.id}
                  </div>
                </>
              ) : (
                <span>
                  ({x}, {y})
                </span>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}
