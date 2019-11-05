"""empty message

Revision ID: a3f4fcd83bce
Revises: 
Create Date: 2019-10-31 20:30:55.322743

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a3f4fcd83bce'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('product',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('bottle_size', sa.Integer(), nullable=False),
    sa.Column('bottle_units', sa.Enum('ML', 'LTR', name='units1'), nullable=False),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('image', sa.String(length=120), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_product_name'), 'product', ['name'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_product_name'), table_name='product')
    op.drop_table('product')
    # ### end Alembic commands ###