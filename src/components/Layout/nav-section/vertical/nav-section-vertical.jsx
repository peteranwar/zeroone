/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import React, { memo, useCallback, useState } from 'react';

import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';

import { Box } from '@mui/material';
import { usePermission } from '../../../../constants';
import NavList from './nav-list';

// ----------------------------------------------------------------------

function NavSectionVertical({ data, slotProps, ...other }) {
  return (
    <Stack component='nav' id='nav-section-vertical' {...other}>
      {data.map((group, index) => (
        <React.Fragment key={group.subheader || index}>
          <Group subheader={group.subheader} items={group.items} slotProps={slotProps} />
          {index !== data.length - 1 && (
            <Box
              sx={{
                border: '1px solid',
                borderImageSource:
                  'linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)',
                borderImageSlice: 1,
                my: 1,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
}

NavSectionVertical.propTypes = {
  data: PropTypes.array,
  slotProps: PropTypes.object,
};

export default memo(NavSectionVertical);

// ----------------------------------------------------------------------

function Group({ subheader, items, slotProps }) {
  const [open, setOpen] = useState(true);
  const { haveAccess } = usePermission();
  const handleToggle = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const renderContent = items.map(list => (
    (haveAccess(list.permission) || list.permission === undefined) && <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
  ));

  return (
    <Stack sx={{ px: 2 }}>
      {subheader ? (
        <>
          <ListSubheader
            disableGutters
            disableSticky
            onClick={handleToggle}
            sx={{
              fontSize: 11,
              cursor: 'pointer',
              typography: 'overline',
              display: 'inline-flex',
              color: '#737791',
              mb: `${slotProps?.gap || 4}px`,
              p: theme => theme.spacing(2, 1, 1, 1.5),
              transition: theme =>
                theme.transitions.create(['color'], {
                  duration: theme.transitions.duration.shortest,
                }),
              '&:hover': {
                color: 'text.primary',
              },
              ...slotProps?.subheader,
            }}
          >
            {subheader}
          </ListSubheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </Stack>
  );
}

Group.propTypes = {
  items: PropTypes.array,
  subheader: PropTypes.string,
  slotProps: PropTypes.object,
};
