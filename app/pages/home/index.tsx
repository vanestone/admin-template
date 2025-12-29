import React, { useEffect, useState, useRef } from 'react';
import './index.less';

const SECTIONS = Array.from({ length: 8 }).map((_, i) => ({
  id: `part-${i + 1}`,
  title: `第 ${i + 1} 部分：CSS滚动高亮原理`,
  content: `在网页开发中，实现"滚动高亮"（ScrollSpy）是一个常见需求。
  通常我们需要监听滚动事件，或者使用 IntersectionObserver API 来检测元素是否进入视口。
  当对应的内容区域进入视口时，我们将导航栏中的对应项标记为"激活"状态。
  
  为了获得更好的性能，推荐使用 IntersectionObserver，因为它是在主线程之外执行的，不会频繁触发重绘。
  
  CSS的 position: sticky 属性可以轻松实现侧边栏的固定效果，配合 JS 的状态切换，就能达成完美的体验。
  `.repeat(10),
}));

const Home = () => {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const options = {
      root: null, // viewport
      // 这里的 rootMargin 非常关键，它定义了视口中触发交互的区域
      // '-10% 0px -80% 0px' 表示只在视口顶部 10% 到 20% 的区域内触发
      // 这样可以确保只有当内容滚动到接近顶部时才高亮对应的标题
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver(callback, options);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // 立即更新 activeId，提升点击时的响应速度
      setActiveId(id);
    }
  };

  return (
    <div className="home-page-scroll-demo">
      <div className="content-left">
        {SECTIONS.map((section) => (
          <div key={section.id} id={section.id} className="section-card">
            <h2>{section.title}</h2>
            <p>{section.content}</p>
            <p>{section.content}</p>
          </div>
        ))}
      </div>

      <div className="anchor-right">
        <div className="anchor-title">目录导航</div>
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className={`anchor-link ${activeId === section.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(section.id);
            }}
          >
            {section.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
