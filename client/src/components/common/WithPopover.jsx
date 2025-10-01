import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

const WithPopover = ({ props, children }) => {
  const popover = (
    <Popover className="w-50">
      <Popover.Header as="h3">{props.popoverTitle}</Popover.Header>
      <Popover.Body>{props.popoverBody}</Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger={props.trigger}
      placement="bottom"
      overlay={popover}
      rootClose={true}
      onToggle={(nextShow) => {
        if (nextShow && props.onPopOver) {
          props.onPopOver();
        } else if (!nextShow && props.onPopOut) {
          setTimeout(() => {
            props.onPopOut();
          }, 300); // so we're sure that the popover has been closed
        }
      }}
      transition={props.transition || false}
    >
      <span className="w-auto">
        {/* // ! div necessary so that the hover event is intercepted even on a disabled element */}
        {children}
      </span>
    </OverlayTrigger>
  );
};

export default WithPopover;
