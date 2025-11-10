import { useState, useEffect, useCallback } from 'react';

import Collapse from '@mui/material/Collapse';

import { usePathname } from '../../../../hooks';
import { useActiveLink } from '../../../../hooks/use-active-link';
import { permissions, usePermission } from '../../../../constants';
import NavItem from './nav-item';

// ----------------------------------------------------------------------

export default function NavList({ data, depth, slotProps }) {
  const pathname = usePathname();
  const { haveAccess } = usePermission();
  const active = useActiveLink(data.path, !!data.children);

  const [openMenu, setOpenMenu] = useState(active);

  useEffect(() => {
    if (!active) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu(prev => !prev);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);
  return (
    <>
      {((data.permission && haveAccess(data.permission)) ||
        permissions.dashboard.read === 'dashboard') && (
        <NavItem
          open={openMenu}
          onClick={handleToggleMenu}
          //
          title={data.title}
          path={data.path}
          icon={data.icon}
          info={data.info}
          roles={data.roles}
          caption={data.caption}
          disabled={data.disabled}
          notification={data.notification}
          //
          depth={depth}
          hasChild={!!data.children}
          externalLink={data.path.includes('http')}
          currentRole={slotProps?.currentRole}
          //
          active={active}
          className={active ? 'active' : ''}
          sx={{
            mb: `${slotProps?.gap}px`,
            ...(depth === 1 ? slotProps?.rootItem : slotProps?.subItem),
          }}
        />
      )}

      {!!data.children && (
        <Collapse in={openMenu} unmountOnExit>
          <NavSubList data={data.children} depth={depth} slotProps={slotProps} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function NavSubList({ data, depth, slotProps }) {
  return (
    <>
      {data.map(list => (
        <NavList key={list.title} data={list} depth={depth + 1} slotProps={slotProps} />
      ))}
    </>
  );
}
