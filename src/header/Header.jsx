// Header.js
import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { usePopper } from 'react-popper';
import { Constants } from '../utils';
import AddColumnHeader from './AddColumnHeader';
import DataTypeIcon from './DataTypeIcon';
import HeaderMenu from './HeaderMenu';

const DND_ITEM_TYPE = 'column';

export default function Header({
  column: { id, created, label, dataType, getResizerProps, getHeaderProps },
  index, 
  moveColumn,
  setSortBy,
  dataDispatch = () => {},
}) {
  
  const [showHeaderMenu, setShowHeaderMenu] = useState(created || false);
  const [headerMenuAnchorRef] = useState(null);
  const [headerMenuPopperRef, setHeaderMenuPopperRef] = useState(null);
  const headerMenuPopper = usePopper(headerMenuAnchorRef, headerMenuPopperRef, {
    placement: 'bottom',
    strategy: 'absolute',
  });
  useEffect(() => {
    if (created) {
      setShowHeaderMenu(true);
    }
  }, [created]);

  const [, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { type: DND_ITEM_TYPE, index },
  });

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item) {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  function getHeader() {
    if (id === Constants.ADD_COLUMN_ID) {
      return (
        <AddColumnHeader
          dataDispatch={dataDispatch}
          getHeaderProps={getHeaderProps}
        />
      );
    }

    return (
      <>
         <div {...getHeaderProps()} className="th noselect d-inline-block" ref={preview}>
          <div
            className="th-content"
            onClick={() => setShowHeaderMenu(true)}
            ref={node => drag(drop(node))}

          >
            <span className="svg-icon svg-gray icon-margin">
              <DataTypeIcon dataType={dataType} />
            </span>
            {label}
          </div>
          <div {...getResizerProps()} className="resizer" />
        </div>
        {showHeaderMenu && (
          <div className="overlay" onClick={() => setShowHeaderMenu(false)} />
        )}
       {showHeaderMenu && (
  <HeaderMenu
    label={label}
    dataType={dataType}
    popper={headerMenuPopper}
    popperRef={setHeaderMenuPopperRef}
    dataDispatch={dataDispatch}
    setSortBy={setSortBy}
    columnId={id}
    setShowHeaderMenu={setShowHeaderMenu}
  />
)}

      </>
    );
  }

  return getHeader();
}
