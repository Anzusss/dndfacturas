import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSidebarOpen } from '@/app/store/slices/uiSlice';
import { MenuItem } from '@/layouts/config/navigationMenu';
import { Badge } from '@gruposerex/ui';
import { clsx } from 'clsx';

interface SidebarMenuItemProps {
  item: MenuItem;
  isOpen: boolean;
  toggleMenu: (id: string) => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, isOpen, toggleMenu }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;
  const isParentActive = hasChildren && item.children?.some((child) => child.to === location.pathname);

  if (hasChildren) {
    return (
      <div className="group">
        {/* Parent Toggle Button */}
        <div
          onClick={() => toggleMenu(item.id)}
          className={clsx(
            'flex items-center justify-between text-white/80 px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors select-none cursor-pointer',
            isParentActive && 'text-white font-bold bg-white/10'
          )}
          title={item.label}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] shrink-0 text-blue-300">
              {item.icon}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider nav-text">
              {item.label}
            </span>
          </div>

          <span
            className={clsx(
              'material-symbols-outlined text-[16px] transition-transform chevron-icon shrink-0 text-white/60',
              isOpen && 'rotate-90 text-white'
            )}
          >
            chevron_right
          </span>
        </div>

        {/* Children Submenu list */}
        {isOpen && (
          <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-1 flex flex-col py-1 sidebar-submenu">
            {item.children?.map((child) => (
              <NavLink
                key={child.id}
                to={child.to || '#'}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={({ isActive }) =>
                  clsx(
                    'nav-link flex items-center justify-between text-white/70 px-3 py-2 hover:bg-white/5 rounded-lg transition-all text-[12px] border-l-4 border-transparent hover:border-white/30 truncate',
                    isActive && 'active bg-white/10 text-white font-bold border-blue-400'
                  )
                }
                title={child.label}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="material-symbols-outlined text-[16px] shrink-0 text-white/70">
                    {child.icon}
                  </span>
                  <span className="truncate">{child.label}</span>
                </div>

                {child.badge && (
                  <div className="sidebar-badge">
                    <Badge variant={child.badge.variant || 'primary'} size="sm">
                      {child.badge.text}
                    </Badge>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Single item without children
  return (
    <NavLink
      to={item.to || '#'}
      onClick={() => dispatch(setSidebarOpen(false))}
      className={({ isActive }) =>
        clsx(
          'flex items-center justify-between text-white/80 px-3 py-2.5 hover:bg-white/5 rounded-xl transition-all text-[12px] select-none',
          isActive && 'active bg-white/10 text-white font-bold'
        )
      }
      title={item.label}
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[18px] shrink-0 text-blue-300">
          {item.icon}
        </span>
        <span className="font-bold uppercase tracking-wider text-[12px] nav-text">
          {item.label}
        </span>
      </div>

      {item.badge && (
        <div className="sidebar-badge">
          <Badge variant={item.badge.variant || 'primary'} size="sm">
            {item.badge.text}
          </Badge>
        </div>
      )}
    </NavLink>
  );
};
