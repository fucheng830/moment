// @/hooks/useDeviceDetect.ts
// 设备监测的hook，可以在初始的时候使用

export enum DeviceType {
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop"
}

import { useState, useEffect } from 'react';

export function useDeviceDetect() {
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.DESKTOP);

  useEffect(() => {
    const detectDevice = () => {
      // 获取用户代理字符串
      const userAgent = typeof window.navigator === "undefined" 
        ? "" 
        : navigator.userAgent.toLowerCase();

      // 获取屏幕宽度
      const width = window.innerWidth;

      // 检测是否为平板设备
      const isTablet = Boolean(
        userAgent.match(/ipad/) ||
        userAgent.match(/tablet/) ||
        (userAgent.match(/android/) && !userAgent.match(/mobile/)) ||
        // Surface 等 Windows 平板
        (userAgent.match(/windows/) && navigator.maxTouchPoints > 0)
      );

      // 检测是否为移动设备
      const isMobile = Boolean(
        userAgent.match(/android/) ||
        userAgent.match(/iphone/) ||
        userAgent.match(/ipod/) ||
        userAgent.match(/blackberry/) ||
        userAgent.match(/windows phone/) ||
        userAgent.match(/opera mini/) ||
        userAgent.match(/iemobile/)
      );

      // 基于设备类型和屏幕宽度做出判断
      if (isTablet || (width >= 768 && width <= 1024)) {
        setDeviceType(DeviceType.TABLET);
      } else if (isMobile || width < 768) {
        setDeviceType(DeviceType.MOBILE);
      } else {
        setDeviceType(DeviceType.DESKTOP);
      }
    };

    // 初始检测
    detectDevice();

    // 监听窗口大小变化
    window.addEventListener('resize', detectDevice);

    // 清理函数
    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  return {
    deviceType,
    isMobile: deviceType === DeviceType.MOBILE,
    isTablet: deviceType === DeviceType.TABLET,
    isDesktop: deviceType === DeviceType.DESKTOP
  };
}