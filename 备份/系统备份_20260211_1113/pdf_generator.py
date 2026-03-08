#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF报告生成器 - PDF Report Generator
作者：虾虾
创建时间：2026-02-08
用途：生成专业PDF报告，专业排版，易于分享
"""

from datetime import datetime
import os


class PDFGenerator:
    """PDF报告生成器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/PDF报告")
        os.makedirs(self.output_dir, exist_ok=True)
        
    def markdown_to_pdf(self, markdown_file):
        """
        Markdown转PDF
        """
        try:
            # 使用pandoc转换
            import subprocess
            
            base_name = os.path.basename(markdown_file).replace('.md', '')
            output_file = f"{self.output_dir}/{base_name}_{datetime.now().strftime('%Y%m%d')}.pdf"
            
            # pandoc命令
            cmd = [
                'pandoc',
                markdown_file,
                '-o', output_file,
                '--pdf-engine=xelatex',
                '-V', 'geometry:margin=2.5cm',
                '-V', 'fontsize=11pt',
                '--toc',
                '--toc-depth=2'
            ]
            
            print(f"🦐 正在生成PDF...")
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✅ PDF生成成功: {output_file}")
                return output_file
            else:
                print(f"❌ PDF生成失败: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ 错误: {e}")
            return None
    
    def generate_daily_report_pdf(self, content):
        """
        直接生成每日报告PDF
        """
        # 先保存为markdown
        md_file = f"{self.output_dir}/temp_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # 转换为PDF
        return self.markdown_to_pdf(md_file)


if __name__ == "__main__":
    import sys
    
    generator = PDFGenerator()
    
    if len(sys.argv) > 1:
        md_file = sys.argv[1]
        generator.markdown_to_pdf(md_file)
    else:
        print("🦐 PDF报告生成器")
        print("用法: python pdf_generator.py <markdown文件>")
