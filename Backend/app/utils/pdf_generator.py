from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime

def generate_invoice_pdf(order, items):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor("#C9A84C"), # PyroCraft Gold
        alignment=1,
        spaceAfter=30
    )
    
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        alignment=0,
        spaceAfter=12
    )

    content = []

    # Title
    content.append(Paragraph("PYROCRAFT", title_style))
    content.append(Paragraph("Premium Celebration Artifacts", ParagraphStyle('SubTitle', parent=styles['Normal'], fontSize=10, alignment=1, textColor=colors.grey, spaceAfter=40)))

    # Order & Customer Info Table
    info_data = [
        [Paragraph(f"<b>TO:</b><br/>{order.name}<br/>{order.address}<br/>{order.city}, {order.state}<br/>{order.pincode}<br/>PH: {order.phone}", styles['Normal']),
         Paragraph(f"<b>INVOICE NO:</b> {order.order_number}<br/><b>DATE:</b> {order.created_at.strftime('%d %b %Y')}<br/><b>STATUS:</b> {order.status.upper()}", styles['Normal'])]
    ]
    
    info_table = Table(info_data, colWidths=[3.5*inch, 2.5*inch])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 20),
    ]))
    content.append(info_table)
    content.append(Spacer(1, 20))

    # Items Table Header
    item_header = [["ITEM", "QTY", "PRICE", "TOTAL"]]
    table_header = Table(item_header, colWidths=[3*inch, 0.8*inch, 1.1*inch, 1.1*inch])
    table_header.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#08080A")),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 10),
    ]))
    content.append(table_header)

    # Items Table Data
    item_rows = []
    for item in items:
        # Note: product name might need to be fetched separately if not in order_item
        product_name = getattr(item.product, 'name', f"Product #{item.product_id}")
        item_rows.append([
            Paragraph(product_name, styles['Normal']),
            str(item.quantity),
            f"INR {item.price:,.2f}",
            f"INR {item.price * item.quantity:,.2f}"
        ])
    
    items_table = Table(item_rows, colWidths=[3*inch, 0.8*inch, 1.1*inch, 1.1*inch])
    items_table.setStyle(TableStyle([
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.lightgrey),
    ]))
    content.append(items_table)

    # Grand Total
    total_data = [
        ["", "", "GRAND TOTAL:", f"INR {order.total_price:,.2f}"]
    ]
    total_table = Table(total_data, colWidths=[3*inch, 0.8*inch, 1.1*inch, 1.1*inch])
    total_table.setStyle(TableStyle([
        ('ALIGN', (2,0), (2,0), 'RIGHT'),
        ('ALIGN', (3,0), (3,0), 'CENTER'),
        ('FONTNAME', (2,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (2,0), (-1,-1), 12),
        ('TEXTCOLOR', (2,0), (-1,-1), colors.HexColor("#C9A84C")),
        ('TOPPADDING', (0,0), (-1,-1), 15),
    ]))
    content.append(total_table)

    # Footer
    content.append(Spacer(1, 100))
    content.append(Paragraph("Thank you for choosing PyroCraft.", ParagraphStyle('Footer', parent=styles['Normal'], alignment=1, textColor=colors.grey)))
    content.append(Paragraph("This is a computer generated invoice and does not require a physical signature.", ParagraphStyle('FooterTiny', parent=styles['Normal'], fontSize=8, alignment=1, textColor=colors.lightgrey, spaceBefore=10)))

    doc.build(content)
    buffer.seek(0)
    return buffer

def generate_order_summary_pdf(orders):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()
    
    content = []
    content.append(Paragraph("PYROCRAFT - Order Summary Report", ParagraphStyle('ReportTitle', parent=styles['Heading1'], alignment=1, spaceAfter=20)))
    content.append(Paragraph(f"Generated on: {datetime.now().strftime('%d %b %Y, %H:%M')}", styles['Normal']))
    content.append(Spacer(1, 20))

    data = [["DATE", "ORDER #", "CUSTOMER", "STATUS", "TOTAL"]]
    for order in orders:
        data.append([
            order.created_at.strftime('%d/%m/%y'),
            order.order_number,
            order.name[:20],
            order.status.upper(),
            f"{order.total_price:,.0f}"
        ])
    
    table = Table(data, colWidths=[0.8*inch, 1.8*inch, 2.5*inch, 1*inch, 1*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#08080A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    content.append(table)

    doc.build(content)
    buffer.seek(0)
    return buffer
